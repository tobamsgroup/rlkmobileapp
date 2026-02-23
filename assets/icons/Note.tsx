import { SvgXml, XmlProps } from 'react-native-svg';

export default (props: Omit<XmlProps, 'xml'>) => {
  const xml = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.75 5.25H11.25M6.75 8.25H11.25M6.75 11.25H9.75M3.75 3.75C3.75 3.35218 3.90804 2.97064 4.18934 2.68934C4.47064 2.40804 4.85218 2.25 5.25 2.25H12.75C13.1478 2.25 13.5294 2.40804 13.8107 2.68934C14.092 2.97064 14.25 3.35218 14.25 3.75V14.25C14.25 14.6478 14.092 15.0294 13.8107 15.3107C13.5294 15.592 13.1478 15.75 12.75 15.75H5.25C4.85218 15.75 4.47064 15.592 4.18934 15.3107C3.90804 15.0294 3.75 14.6478 3.75 14.25V3.75Z" stroke="#1671D9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;
  let prop = { ...props, xml: xml };
  return <SvgXml {...prop} />;
};
