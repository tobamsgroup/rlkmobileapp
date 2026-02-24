import { SvgXml, XmlProps } from 'react-native-svg';

export default (props: Omit<XmlProps, 'xml'>) => {
  const strokeColor = props?.stroke || '#3F9243';
  const xml = `     width= "24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 9.7998H16M8 13.7998H14M14.5 19.2998L12 21.7998L9 18.7998H6C5.20435 18.7998 4.44129 18.4837 3.87868 17.9211C3.31607 17.3585 3 16.5955 3 15.7998V7.7998C3 7.00416 3.31607 6.24109 3.87868 5.67848C4.44129 5.11588 5.20435 4.7998 6 4.7998H18C18.7956 4.7998 19.5587 5.11588 20.1213 5.67848C20.6839 6.24109 21 7.00416 21 7.7998V12.2998M19 22.7998V22.8098M19 19.7998C19.4483 19.7984 19.8832 19.6466 20.235 19.3688C20.5868 19.0909 20.8352 18.7031 20.9406 18.2673C21.0459 17.8316 21.0019 17.3731 20.8158 16.9653C20.6297 16.5574 20.3122 16.2238 19.914 16.0178C19.5162 15.814 19.0611 15.7508 18.6228 15.8385C18.1845 15.9262 17.7888 16.1596 17.5 16.5008"
        stroke=${String(strokeColor)}
        strokeWidth={props?.strokeWidth || "2"}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
`;
  let prop = { ...props, xml: xml };
  return <SvgXml {...prop} />;
};
