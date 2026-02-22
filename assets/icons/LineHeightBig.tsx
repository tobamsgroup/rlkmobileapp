import { SvgXml, XmlProps } from 'react-native-svg';

export default (props: Omit<XmlProps, 'xml'>) => {
  const xml = `<svg width="32" height="26" viewBox="0 0 32 26" fill="none" xmlns="http://www.w3.org/2000/svg">
<line y1="1" x2="32" y2="1" stroke="#474348" stroke-width="2"/>
<line y1="13" x2="32" y2="13" stroke="#474348" stroke-width="2"/>
<line y1="25" x2="32" y2="25" stroke="#474348" stroke-width="2"/>
</svg>
`;
  let prop = { ...props, xml: xml };
  return <SvgXml {...prop} />;
};
