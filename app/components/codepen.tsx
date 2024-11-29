import React, { FunctionComponent } from 'react';
export interface ICodePenProps {
  /** CodePen id */
  codePenId: string;
  /** Height for the iFrame */
  height?: number;
  /** Which tabs to display */
  tabs?: string[] | 'js' | 'css' | 'scss' | 'less' | 'result';
  /** Load pen in a preview state? **/
  clickToLoad?: boolean;
  /** Make the CodePen editable **/
  editable?: boolean;
  /** Theme of the CodePen **/
  theme?: string | 'light' | 'dark' | 'default';
}

export const CodePen: FunctionComponent<ICodePenProps> = ({
  codePenId,
  height = 500,
  tabs = 'result',
  clickToLoad = false,
  editable = false,
  theme = 'default',
}: ICodePenProps) => (
  <iframe
    data-testid="codepen"
    title={`codepen-${codePenId}`}
    className="my-4"
    height={height}
    style={{
    width: '100%',
    }}
    scrolling="no"
    src={`https://codepen.io/team/codepen/embed${
    clickToLoad ? '/preview' : ''
    }/${codePenId}?height=${height}&theme-id=${theme}&default-tab=${tabs}${editable ? '&editable=true' : ''}`}
    frameBorder="no"
    allowFullScreen
  />
);
