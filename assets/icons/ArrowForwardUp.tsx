import { SvgXml, XmlProps } from 'react-native-svg';

export default (props: Omit<XmlProps, 'xml'>) => {
  const xml = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12.5007 11.6667L15.834 8.33333M15.834 8.33333L12.5007 5M15.834 8.33333H6.66732C5.78326 8.33333 4.93542 8.68452 4.31029 9.30964C3.68517 9.93477 3.33398 10.7826 3.33398 11.6667C3.33398 12.5507 3.68517 13.3986 4.31029 14.0237C4.93542 14.6488 5.78326 15 6.66732 15H7.50065" stroke="#474348" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

`;
  let prop = { ...props, xml: xml };
  return <SvgXml {...prop} />;
};
