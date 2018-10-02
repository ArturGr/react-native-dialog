import React from "react";
import PropTypes from "prop-types";
import { KeyboardAvoidingView, Platform, StyleSheet, View, TouchableOpacity } from "react-native";
import AnimatedModal from "react-native-modal";

const IOS_MODAL_ANIMATION = {
  from: { opacity: 0, scale: 1.2 },
  0.5: { opacity: 1 },
  to: { opacity: 1, scale: 1 }
};

export default class DialogContainer extends React.PureComponent {
  static propTypes = {
    blurComponentIOS: PropTypes.node,
    children: PropTypes.node.isRequired,
    visible: PropTypes.bool,
    onRequestClose: PropTypes.func,
  };

  static defaultProps = {
    visible: false
  };

  render() {
    const {
      blurComponentIOS, children, visible, onRequestClose, ...otherProps
    } = this.props;
    const titleChildrens = [];
    const descriptionChildrens = [];
    const buttonChildrens = [];
    const otherChildrens = [];
    React.Children.forEach(children, child => {
      if (!child) {
        return;
      }
      if (
        child.type.name === "DialogTitle" ||
        child.type.displayName === "DialogTitle"
      ) {
        titleChildrens.push(child);
      } else if (
        child.type.name === "DialogDescription" ||
        child.type.displayName === "DialogDescription"
      ) {
        descriptionChildrens.push(child);
      } else if (
        child.type.name === "DialogButton" ||
        child.type.displayName === "DialogButton"
      ) {
        if (Platform.OS === "ios" && buttonChildrens.length > 0) {
          buttonChildrens.push(<View style={styles.buttonSeparator} />);
        }
        buttonChildrens.push(child);
      } else {
        otherChildrens.push(child);
      }
    });
    return (
      <AnimatedModal
        backdropOpacity={0.3}
        style={styles.modal}
        isVisible={visible}
        animationIn={Platform.OS === "ios" ? IOS_MODAL_ANIMATION : "zoomIn"}
        animationOut={"fadeOut"}
        {...otherProps}
      ><TouchableOpacity activeOpacity={1} onPress={onRequestClose} style={styles.touchable} >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.container} 
          >
            <View style={styles.content}>
              {Platform.OS === "ios" && blurComponentIOS}
              {Platform.OS === "ios" &&
                !blurComponentIOS && <View style={styles.blur} />}
              <View style={styles.header}>
                {titleChildrens}
                {descriptionChildrens}
              </View>
              {otherChildrens}
              {Boolean(buttonChildrens.length) && <View style={styles.footer}>
                {buttonChildrens.map((x, i) =>
                  React.cloneElement(x, {
                    key: `dialog-button-${i}`
                  })
                )}
              </View>}
            </View>
          </KeyboardAvoidingView>
        </TouchableOpacity>
      </AnimatedModal>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    marginBottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)'
  },
  touchable: {
    flex: 1,
    alignSelf: 'stretch',
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 32,
    marginRight: 32,
  },
  blur: {
    position: "absolute",
    backgroundColor: "rgb(255,255,255)",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  },
  content: Platform.select({
    ios: {
      alignSelf: 'stretch',
      flexDirection: "column",
      overflow: "hidden"
    },
    android: {
      flexDirection: "column",
      overflow: "hidden",
    }
  }),
  header: Platform.select({
    ios: {
      margin: 0
    },
    android: {
      margin: 0
    }
  }),
  footer: Platform.select({
    ios: {
      flexDirection: "row",
      justifyContent: "space-between",
      borderTopColor: "#A9ADAE",
      borderTopWidth: StyleSheet.hairlineWidth,
    },
    android: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
    }
  }),
  buttonSeparator: {
    height: "100%",
    backgroundColor: "#A9ADAE",
    width: StyleSheet.hairlineWidth
  }
});
