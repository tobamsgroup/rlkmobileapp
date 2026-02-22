import { SvgXml, XmlProps } from 'react-native-svg';

export default (props: Omit<XmlProps, 'xml'>) => {
  const xml = `<svg width="32" height="10" viewBox="0 0 32 10" fill="none" xmlns="http://www.w3.org/2000/svg">
<line y1="1" x2="32" y2="1" stroke="#474348" stroke-width="2"/>
<line y1="5" x2="32" y2="5" stroke="#474348" stroke-width="2"/>
<line y1="9" x2="32" y2="9" stroke="#474348" stroke-width="2"/>
</svg>
`;
  let prop = { ...props, xml: xml };
  return <SvgXml {...prop} />;
};
