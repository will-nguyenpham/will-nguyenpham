import React, { useEffect, useState} from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch } from 'react-instantsearch-hooks';
import insightsClient from 'search-insights';
import { createAlgoliaInsightsPlugin } from '@algolia/autocomplete-plugin-algolia-insights';
import { Autocomplete } from '../components';
import styles from './index.module.scss';
import Link from '@docusaurus/Link';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={styles.header}>
      <h3 className={styles.header.title}>{siteConfig.title}</h3>
    </header>
  );
}

function search(searchClient, siteConfig, algoliaInsightsPlugin) {
  return (
    <div style={{ width: "45%", position: "absolute", left: 0, right: 0, margin: "auto", marginTop: "-41px" }}>
      <InstantSearch
        searchClient={searchClient}
        indexName={siteConfig.customFields.indexName}
        routing
      >
        <Autocomplete
          searchClient={searchClient}
          algoliaInsightsPlugin={algoliaInsightsPlugin}
          placeholder="Search documentation..."
          detachedMediaQuery="none"
          openOnFocus
          indexName={siteConfig.customFields.indexName}
        />
      </InstantSearch>
    </div>
  );
}

var searchClient;
var algoliaInsightsPlugin;

function hideNotiBanner(setHideNoti) {
  setHideNoti(true);
}

function createNotiBanner(setHideNoti) {
  const Svgwarning = require('@site/static/img/ic_warning.svg').default;
  const Svgclose = require('@site/static/img/ic_close.svg').default;
  return (<div className={styles.viewParentNoti}>
     <div className={styles.notification}>
      <Svgwarning style={{ marginRight: "7px" }}/>
      <p className={styles.text}>
        Katalon documentation is changing! Information is now organized by activity rather than product.<br></br>
        You can still find the older structure in the legacy version.
      </p>
    </div>
    <button className={styles.close} onClick={() => hideNotiBanner(setHideNoti)}><Svgclose/></button>
  </div>);
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  if (searchClient == undefined) {
    searchClient = algoliasearch(siteConfig.customFields.appId, siteConfig.customFields.apiKey);
    insightsClient('init', { appId: siteConfig.customFields.appId, apiKey: siteConfig.customFields.apiKey, useCookie: true });
    algoliaInsightsPlugin = createAlgoliaInsightsPlugin({ insightsClient });
  }

  const [hideNoti, setHideNoti] = useState(false);

  return (
    <Layout>
      <div>
        {!hideNoti && createNotiBanner(setHideNoti)}
        <HomepageHeader />
        {search(searchClient, siteConfig, algoliaInsightsPlugin)}
        <main>
          <HomepageFeatures />
        </main>
      </div>
    </Layout>
  );
}
