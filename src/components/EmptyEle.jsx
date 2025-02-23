import React from "react";

const EmptyEle = ({ content }) => {
  // Parsing the content into HTML and CSS (if it's in a specific format)
  const [htmlContent, setHtmlContent] = React.useState("");
  const [cssContent, setCssContent] = React.useState("");

  // Split the content into HTML and CSS (if it's well-structured as <div>... <style>...</style>)
  React.useEffect(() => {
    if (content) {
      const splitContent = content.split("<style>");
      const html = splitContent[0].trim();
      const css = splitContent[1] ? splitContent[1].replace("</style>", "").trim() : "";
      
      setHtmlContent(html);
      setCssContent(css);
    }
  }, [content]);

  return (
    <div>
      {/* Apply the CSS content dynamically if it exists */}
      {cssContent && <style>{cssContent}</style>}
      
      {/* Render the HTML content */}
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
};

export default EmptyEle;
