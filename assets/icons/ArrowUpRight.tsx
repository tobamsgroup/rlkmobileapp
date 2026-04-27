

import { SvgXml, XmlProps } from 'react-native-svg';

export default (props: Omit<XmlProps, 'xml'>) => {
  const xml = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17 7L7 17M17 7H8M17 7V16" stroke="#3F9243" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>


`;
  let prop = { ...props, xml: xml };
  return <SvgXml {...prop} />;
};
