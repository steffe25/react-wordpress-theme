import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './../styles/PageContent.css'; // Import your CSS file

const PageContent = () => {
  const [content, setContent] = useState('');
  const { slug } = useParams();
  const [isContentVisible, setIsContentVisible] = useState(false);

  useEffect(() => {
    // Reset isContentVisible to false before fetching content
    setIsContentVisible(false);

    async function fetchData() {
      try {
        const baseUrl = window.location.origin;

        if (!slug) {
          // Fetch the frontpage content if slug is empty
          const frontPageResponse = await fetch(
            `${baseUrl}/wp-json/wp/v2/pages?frontpage=true`
          );

          if (!frontPageResponse.ok) {
            throw new Error(`HTTP error! status: ${frontPageResponse.status}`);
          }

          const frontPageData = await frontPageResponse.json();

          if (frontPageData.length > 0) {
            setContent(frontPageData[0].content.rendered);
          } else {
            setContent('<p>No frontpage content found.</p>');
          }
        } else {
          // Fetch content based on the provided slug, assuming it's either a page or post
          const response = await fetch(
            `${baseUrl}/wp-json/wp/v2/pages?slug=${slug}`
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();

          if (data.length > 0) {
            setContent(data[0].content.rendered);
          } else {
            // Attempt to search for post content
            const postResponse = await fetch(
              `${baseUrl}/wp-json/wp/v2/posts?slug=${slug}`
            );

            if (!postResponse.ok) {
              throw new Error(`HTTP error! status: ${postResponse.status}`);
            }

            const postData = await postResponse.json();

            if (postData.length > 0) {
              setContent(postData[0].content.rendered);
            } else {
              setContent('<p>No content found.</p>');
            }
          }
        }
      } catch (error) {
        console.error('Fetching error:', error.message);
        setContent(`<p>Error loading content: ${error.message}</p>`);
      }

      // Set isContentVisible to true after fetching content
      setIsContentVisible(true);
    }

    fetchData();
  }, [slug]);

  return (
    <div className={`page-content ${isContentVisible ? 'show' : ''}`} dangerouslySetInnerHTML={{ __html: content }} />
  );
};

export default PageContent;
