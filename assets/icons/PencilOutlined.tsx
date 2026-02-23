import { SvgXml, XmlProps } from 'react-native-svg';

export default (props: Omit<XmlProps, 'xml'>) => {
  const strokeColor = props?.stroke || '#474348';
  const xml = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.2507 5.41676L14.584 8.75009M3.33398 16.6668H6.66732L15.4173 7.91676C15.8593 7.47473 16.1077 6.87521 16.1077 6.25009C16.1077 5.62497 15.8593 5.02545 15.4173 4.58342C14.9753 4.14139 14.3758 3.89307 13.7507 3.89307C13.1255 3.89307 12.526 4.1414 12.084 4.58342L3.33398 13.3334V16.6668Z" stroke=${String(strokeColor)} stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

`;
  let prop = { ...props, xml: xml };
  return <SvgXml {...prop} />;
};
