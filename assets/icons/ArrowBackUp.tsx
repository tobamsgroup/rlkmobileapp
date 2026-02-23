import { SvgXml, XmlProps } from 'react-native-svg';

export default (props: Omit<XmlProps, 'xml'>) => {
  const xml = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.49935 11.6667L4.16602 8.33333M4.16602 8.33333L7.49935 5M4.16602 8.33333H13.3327C14.2167 8.33333 15.0646 8.68452 15.6897 9.30964C16.3148 9.93477 16.666 10.7826 16.666 11.6667C16.666 12.5507 16.3148 13.3986 15.6897 14.0237C15.0646 14.6488 14.2167 15 13.3327 15H12.4993" stroke="#474348" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
</svg>


`;
  let prop = { ...props, xml: xml };
  return <SvgXml {...prop} />;
};
