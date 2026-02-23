


import { SvgXml, XmlProps } from 'react-native-svg';

export default (props: Omit<XmlProps, 'xml'>) => {
  const strokeColor = props?.stroke || '#474348';
  const xml = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15.8327 16.6665H7.08269L3.57436 13.0832C3.41915 12.927 3.33203 12.7158 3.33203 12.4957C3.33203 12.2755 3.41915 12.0643 3.57436 11.9082L11.9077 3.57485C12.0638 3.41964 12.275 3.33252 12.4952 3.33252C12.7153 3.33252 12.9266 3.41964 13.0827 3.57485L17.2494 7.74151C17.4046 7.89765 17.4917 8.10886 17.4917 8.32901C17.4917 8.54917 17.4046 8.76038 17.2494 8.91651L9.58269 16.6665M14.9994 11.0832L9.74936 5.83318" stroke=${String(strokeColor)} stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;
  let prop = { ...props, xml: xml };
  return <SvgXml {...prop} />;
};
