import axios from 'axios';

/**
 *
 * ## renderFrameDom主渲染函数
 * @param {source} source
 * @param {option} options
 */
const renderFrameDom = async (source, options) => {
  const { resourceLink, assetList, cdnLinks } = source;
  let html = "",
    css = "",
    javascript = "";
  async function getLinks() {
    Promise.all([
      await axios(`${resourceLink}/index.html`).then((res) => {
        html = res.data;
        return res;
      }),
      await axios(`${resourceLink}/index.js`).then((res) => {
        javascript = res.data;
        return res;
      }),
      await axios(`${resourceLink}/index.css`).then((res) => {
        css = res.data;
        return res;
      }),
    ])
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  await getLinks();
  // await getLinkStart();
  // replace souce link from codepen.io
  let styleCode =
    `body::-webkit-scrollbar {width: 6px;height: 6px;background: #fff000}body::-webkit-scrollbar-track {box-shadow: inset 0 0 0px rgba(240, 240, 240, .5);border-radius: 10px;background: #fff;}body::-webkit-scrollbar-thumb {border-radius: 10px;box-shadow: inset 0 0 0px rgba(118, 118, 118, 0.5);background-color: #6a5f54;}html,body{width:100%;background:#fff;overflow-x:hidden;overflow-y:auto;margin:0px;height:100%;z-index:0;font-size:12px}\n` +
    css.replaceAll(
      /https:\/\/assets.codepen.io\/\d{1,12}\//g,
      `${resourceLink}/`
    );
  let htmlCode = html.replaceAll(
    /https:\/\/assets.codepen.io\/\d{1,12}\//g,
    `${resourceLink}/`
  );
  let jsCode = javascript;
  // pollyfill for multiple dirs file
  for (var link of assetList) {
    styleCode = styleCode.replace(
      link.includes("assets.codepen")
        ? `${resourceLink}/${[...link.split("/")]
            .slice(-(link.split("/").length - 2))
            .join("/")}`
        : `https://${link}`,
      `${resourceLink}/${link.split("/")[link.split("/").length - 1]}`
    );
    htmlCode = htmlCode.replace(
      link.includes("assets.codepen")
        ? `${resourceLink}/${[...link.split("/")]
            .slice(-(link.split("/").length - 2))
            .join("/")}`
        : `https://${link}`,
      `${resourceLink}/${link.split("/")[link.split("/").length - 1]}`
    );
    afterTransCode = afterTransCode.replace(
      link.includes("assets.codepen")
        ? `${resourceLink}/${[...link.split("/")]
            .slice(-(link.split("/").length - 2))
            .join("/")}`
        : `https://${link}`,
      `${resourceLink}/${link.split("/")[link.split("/").length - 1]}`
    );
  }
  // init style dom
  const style = document.createElement("style");
  style.setAttribute("type", "text/css");
  style.innerHTML = styleCode;
  // html
  const htmlDom = document.createElement("html");

  const bodyDom = document.createElement("body");

  htmlDom.appendChild(style);
  bodyDom.innerHTML = htmlCode;
  // script dom
  const jscontent = document.createElement("script");
  jscontent.setAttribute("type", "module");
  // prepare to handle some specifics
  let js = `${jsCode}`.replaceAll(
    /https:\/\/assets.codepen.io\/\d{1,12}\//g,
    `${resourceLink}/`
  );
  jscontent.innerHTML = js;
  bodyDom.appendChild(jscontent);
  // 最外层为html
  htmlDom.appendChild(bodyDom);
  const { width = "100%", height = "100%", target = null } = options;
  //iframe dom
  let curFrame = document.createElement("iframe");
  curFrame.setAttribute("width", width);
  curFrame.setAttribute("height", height);
  curFrame.setAttribute("style", "border:0px");
  curFrame.setAttribute("srcdoc", `<!DOCTYPE html>${htmlDom.innerHTML}`);
  target && document.querySelector(target).appendChild(curFrame);
};

export { renderFrameDom };
//# sourceMappingURL=bundle.esm.js.map
