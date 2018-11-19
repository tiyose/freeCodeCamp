import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isNull, pick, isEmpty } from 'lodash';
import { navigate } from 'gatsby';

import Layout from '../components/layouts/Default';
import NotFoundPage from '../components/FourOhFour';
import Loader from '../components/helpers/Loader';

import { getShortIdFromSlug } from '../utils';
import { createArticleSlug } from '../../utils/news';
import {
  resolveShortId,
  resolveShortIdFetchStateSelector,
  dynamicArticleByIdMapSelector
} from '../templates/News/redux';
import { createFlashMessage } from '../components/Flash/redux';
import ShowArticle from '../templates/News/ShowArticle';

const mapStateToProps = () => (state, { articleSlug = '' }) => {
  const shortId = getShortIdFromSlug(articleSlug);
  const articleMap = dynamicArticleByIdMapSelector(state);
  const article = articleMap[shortId] || null;
  const fetchState = resolveShortIdFetchStateSelector(state);
  return { article, fetchState, shortId };
};
const mapDispatchToProps = dispatch =>
  bindActionCreators({ createFlashMessage, resolveShortId }, dispatch);

class DynamicNewsArticle extends Component {
  constructor(props) {
    super(props);

    this.getArticleAsGatsbyProps = this.getArticleAsGatsbyProps.bind(this);
  }
  componentDidMount() {
    const { shortId, article, resolveShortId } = this.props;
    if (isNull(article)) {
      return resolveShortId(shortId);
    }
    return null;
  }

  componentDidUpdate(nextProps) {
    const {
      article,
      fetchState: { complete }
    } = nextProps;
    const { createFlashMessage } = this.props;
    if ((isNull(article) || isEmpty(article)) && complete) {
      createFlashMessage({
        type: 'info',
        message:
          "We couldn't find what you were looking for, " +
          'please check and try again'
      });
      navigate('/news');
    }
    return;
  }

  getArticleAsGatsbyProps() {
    const { article } = this.props;
    const {
      author: { username },
      slugPart,
      shortId,
      meta: { readTime }
    } = article;

    return {
      data: {
        newsArticleNode: {
          ...pick(article, [
            'title',
            'renderableContent',
            'youtube',
            'author',
            'firstPublishedDate',
            'shortId',
            'featureImage'
          ]),
          fields: { slug: createArticleSlug({ username, slugPart, shortId }) },
          meta: { readTime }
        }
      }
    };
  }

  render() {
    const {
      splat,
      fetchState: { pending }
    } = this.props;
    if (splat) {
      // This is an incorrect URL - 404
      return <NotFoundPage />;
    }
    if (pending) {
      return (
        <Layout>
          <div className='loader-wrapper'>
            <Loader />
          </div>
        </Layout>
      );
    }
    return <ShowArticle {...this.getArticleAsGatsbyProps()} />;
  }
}
DynamicNewsArticle.displayName = 'DynamicNewsArticle';

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DynamicNewsArticle);
