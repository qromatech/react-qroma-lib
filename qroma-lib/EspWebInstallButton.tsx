import React, { FunctionComponent } from 'react';
import { Fragment } from 'react';


type EspWebInstallButtonProps = {
  label: string
  instructionsText: string
  manifestPath: string
}

export const EspWebInstallButton: FunctionComponent<EspWebInstallButtonProps> =
  (props: EspWebInstallButtonProps) => {

  const activateComponent =
    <div slot="activate" key={`activate`}>
      <button color="primary">{props.label}</button>
    </div>

  const unsupportedComponent =
    <span slot="unsupported" key="unsupported">Sorry - your browser isn't supported. You will need to use Google Chrome or Microsoft Edge to connect or install instead.</span>;

  const notAllowedComponent =
    <span slot="not-allowed" key="not-allowed">Not allowed on HTTP (requires HTTPS connection)</span>;

  const installButtonElement = React.createElement('esp-web-install-button',
    {
      manifest: props.manifestPath,
      children: [activateComponent, unsupportedComponent, notAllowedComponent]
    });

  return <Fragment>
    <p>{props.instructionsText}</p>
    {installButtonElement}
  </Fragment>
}