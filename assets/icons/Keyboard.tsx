import { SvgXml, XmlProps } from 'react-native-svg';

export default (props: Omit<XmlProps, 'xml'>) => {
    const strokeColor = props?.stroke || "white"
  const xml = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.99935 8.33333V8.34167M8.33268 8.33333V8.34167M11.666 8.33333V8.34167M14.9993 8.33333V8.34167M4.99935 11.6667V11.675M14.9993 11.6667V11.675M8.33268 11.6667L11.666 11.675M1.66602 6.66667C1.66602 6.22464 1.84161 5.80072 2.15417 5.48816C2.46673 5.17559 2.89065 5 3.33268 5H16.666C17.108 5 17.532 5.17559 17.8445 5.48816C18.1571 5.80072 18.3327 6.22464 18.3327 6.66667V13.3333C18.3327 13.7754 18.1571 14.1993 17.8445 14.5118C17.532 14.8244 17.108 15 16.666 15H3.33268C2.89065 15 2.46673 14.8244 2.15417 14.5118C1.84161 14.1993 1.66602 13.7754 1.66602 13.3333V6.66667Z" stroke=${String(strokeColor)} stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;
  let prop = { ...props, xml: xml };
  return <SvgXml {...prop} />;
};
