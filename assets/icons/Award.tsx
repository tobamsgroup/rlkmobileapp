import { SvgXml, XmlProps } from 'react-native-svg';

export default (props: Omit<XmlProps, 'xml'>) => {
  const xml = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.001 12.5C8.67487 12.5 7.4031 11.9732 6.46542 11.0355C5.52774 10.0979 5.00096 8.82608 5.00096 7.5C5.00096 6.17392 5.52774 4.90215 6.46542 3.96447C7.4031 3.02678 8.67487 2.5 10.001 2.5C11.327 2.5 12.5988 3.02678 13.5365 3.96447C14.4742 4.90215 15.001 6.17392 15.001 7.5C15.001 8.82608 14.4742 10.0979 13.5365 11.0355C12.5988 11.9732 11.327 12.5 10.001 12.5ZM10.001 12.5L12.8343 17.4083L14.166 14.7142L17.1643 14.9075L14.331 10M5.66927 10L2.83594 14.9083L5.83427 14.7142L7.16594 17.4075L9.99927 12.5" stroke="#C821DE" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;
  let prop = { ...props, xml: xml };
  return <SvgXml {...prop} />;
};
