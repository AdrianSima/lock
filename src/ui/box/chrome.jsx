import React from 'react';
import ReactDOM from 'react-dom';
import ReactTransitionGroup from 'react-addons-transition-group';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import MultisizeSlide from './multisize_slide';
import GlobalMessage from './global_message';
import Header from './header';

const submitSvg = '<svg width="43px" height="42px" viewBox="0 0 43 42" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage"><g id="Lock" sketch:type="MSArtboardGroup" transform="translate(-280.000000, -3592.000000)"><g id="SMS" sketch:type="MSLayerGroup" transform="translate(153.000000, 3207.000000)"><g id="Group" sketch:type="MSShapeGroup"><g id="Login" transform="translate(0.000000, 369.000000)"><g id="Btn"><g id="Oval-302-+-Shape" transform="translate(128.000000, 17.000000)"><circle id="Oval-302" stroke="#FFFFFF" stroke-width="2" cx="20.5" cy="20" r="20"></circle><path d="M17.8,15.4 L19.2,14 L25.2,20 L19.2,26 L17.8,24.6 L22.4,20 L17.8,15.4 Z" id="Shape" fill="#FFFFFF"></path></g></g></g></g></g></g></g></svg>';

class SubmitButton extends React.Component {

  focus() {
    ReactDOM.findDOMNode(this).focus();
  }

  render() {
    const { color, disabled } = this.props;

    return (
      <button
        className="auth0-lock-submit"
        disabled={disabled}
        style={{backgroundColor: color}}
        type="submit"
      >
        <div className="auth0-loading-container">
          <div className="auth0-loading" />
        </div>
        <span dangerouslySetInnerHTML={{__html: submitSvg}} />
      </button>
    );
  }

}

SubmitButton.propTypes = {
  disabled: React.PropTypes.bool
};

export default class Chrome extends React.Component {

  constructor(props) {
    super(props);
    this.state = {reverse: false};
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.showSubmitButton
        && !this.state.delayingShowSubmitButton
        && nextProps.showSubmitButton) {
      this.setState({delayingShowSubmitButton: true});
    }
  }

  onWillSlide() {
    this.sliding = true;
  }

  onDidSlide() {
    this.sliding = false;
    this.setState({reverse: false});
  }

  onDidAppear() {
    if (this.state.delayingShowSubmitButton) {
      this.setState({delayingShowSubmitButton: false});
    }
  }

  render() {
    const {
      avatar,
      auxiliaryPane,
      backHandler,
      contentComponent,
      contentProps,
      disableSubmitButton,
      error,
      headerless,
      isSubmitting,
      logo,
      primaryColor,
      screenName,
      showSubmitButton,
      success,
      terms,
      title,
      transitionName
    } = this.props;

    const { delayingShowSubmitButton, reverse } = this.state;

    let backgroundUrl, name;
    if (avatar) {
      backgroundUrl = avatar;
      name = title;
    } else {
      backgroundUrl = logo;
      name = "";
    }

    const header = headerless
      ? null
      :  <Header
           backHandler={backHandler && ::this.handleBack}
           backgroundColor={primaryColor}
           backgroundUrl={backgroundUrl}
           logoUrl={logo}
           name={name}
           title={title}
         />;

    const submitButton = showSubmitButton
      && !delayingShowSubmitButton
      && <SubmitButton
            color={primaryColor}
            disabled={disableSubmitButton}
            key="submit"
            ref="submit"
         />;

    const globalError = error
      ? <GlobalMessage key="global-error" message={error} type="error" />
      : null;
    const globalSuccess = success
      ? <GlobalMessage key="global-success" message={success} type="success" />
      : null;

    const Content = contentComponent;

    return (
      <div className="auth0-lock-cred-pane">
        {header}
        <ReactTransitionGroup>
          {globalSuccess}
          {globalError}
        </ReactTransitionGroup>
        <div style={{position: "relative"}}>
          <MultisizeSlide
            delay={550}
            onDidAppear={::this.onDidAppear}
            onDidSlide={::this.onDidSlide}
            onWillSlide={::this.onWillSlide}
            transitionName={transitionName}
            reverse={reverse}
          >
            <div key={screenName} className="auth0-lock-view-content">
              <div style={{position: "relative"}}>
                <div className="auth0-lock-body-content">
                <div className="auth0-lock-content" key={screenName}>
                  <div className="auth0-lock-form">
                    <Content focusSubmit={::this.focusSubmit} {...contentProps} />
                  </div>
                </div>
                {terms && <small className="auth0-lock-terms">{terms}</small>}
                </div>
              </div>
            </div>
          </MultisizeSlide>
        </div>
        <ReactCSSTransitionGroup
            transitionEnterTimeout={400}
            transitionLeaveTimeout={400}
            transitionName="vslide"
        >
          {submitButton}
        </ReactCSSTransitionGroup>
        <ReactCSSTransitionGroup transitionName="slide" transitionEnterTimeout={350} transitionLeaveTimeout={350}>
          {auxiliaryPane}
        </ReactCSSTransitionGroup>
      </div>
    );
  }

  focusSubmit() {
    this.refs.submit.focus();
  }

  handleBack() {
    if (this.sliding) return;

    const { backHandler } = this.props;
    this.setState({reverse: true});
    backHandler();
  }

}

Chrome.propTypes = {
  avatar: React.PropTypes.string,
  auxiliaryPane: React.PropTypes.element,
  backHandler: React.PropTypes.func,
  contentComponent: React.PropTypes.func.isRequired, // TODO: it also can be a class component
  contentProps: React.PropTypes.object.isRequired,
  disableSubmitButton: React.PropTypes.bool.isRequired,
  error: React.PropTypes.string,
  headerless: React.PropTypes.bool.isRequired,
  isSubmitting: React.PropTypes.bool.isRequired,
  logo: React.PropTypes.string.isRequired,
  primaryColor: React.PropTypes.string.isRequired,
  showSubmitButton: React.PropTypes.bool.isRequired,
  success: React.PropTypes.string,
  terms: React.PropTypes.element,
  title: React.PropTypes.string.isRequired,
  transitionName: React.PropTypes.string.isRequired
};

Chrome.defaultProps = {
  disableSubmitButton: false,
  headerless: false,
  showSubmitButton: true
};

global.window.React = React;
