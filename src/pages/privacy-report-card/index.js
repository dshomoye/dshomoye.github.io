import React from 'react';
import { graphql } from 'gatsby';

import Layout from '../../components/layout';
import Table from '../../components/Table';
import useViewSize from '../../hooks/useViewSize';

const privcayData = [
  {
    id: 1,
    name: 'Google',
    crossSiteTracking: 5,
    locationTracking: 5,
    dataRetention: 4,
    userControl: 4,
    darkPatterns: 5,
    summaryLink: '/privacy-report-card/google',
    referenceLink: 'https://policies.google.com/privacy',
  },
];

const dataColumns = [
  {
    key: 'name',
    title: 'Service Summary',
    frozen: true,
    linkKey: 'summaryLink',
    type: 'link',
  },
  {
    key: 'crossSiteTracking',
    title: 'Cross Site Tracking',
  },
  {
    key: 'locationTracking',
    title: 'Location Tracking',
  },
  {
    key: 'dataRetention',
    title: 'Data Retentation',
  },
  {
    key: 'userControl',
    title: 'User Control',
  },
  {
    key: 'darkPatterns',
    title: 'Dark Pattern Usage',
  },
  {
    key: 'reference',
    title: 'Policy Reference',
    linkKey: 'referenceLink',
    type: 'link',
    linkText: 'View ↗',
  },
];

const PrivacyReportCard = ({ data, location }) => {
  const { width: viewWidth } = useViewSize();
  const { title } = data.site.siteMetadata;

  const equalWidth = Math.floor(viewWidth / dataColumns.length) - 10;
  const columnWidth = equalWidth > 100 ? equalWidth : 100;
  for (let i = 0; i < dataColumns.length; i += 1) {
    dataColumns[i].width = columnWidth;
    dataColumns[i].resizable = true;
  }

  return (
    <Layout title={title} location={location} fullWidth>
      <h2>
        Privacy Report: Summary of privacy policies of (popular) services.
      </h2>
      <hr />
      <Table columns={dataColumns} data={privcayData} rowKey="id" />
    </Layout>
  );
};

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`;

export default PrivacyReportCard;
