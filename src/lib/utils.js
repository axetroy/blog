/**
 * Created by axetroy on 17-4-24.
 */

/**
 * 字符串首字母大写
 * @export
 * @param {any} str
 * @returns
 */
export function firstUpperCase(str) {
  return str.toLowerCase().replace(/\b[a-z]/g, function(s) {
    return s.toUpperCase();
  });
}

/**
 * 获取两个时间的时间差
 * @export
 * @param {any} time1
 * @returns
 */
export function diffTime(time1) {
  return function(time2) {
    let seconds = Math.abs(time1 - time2) / 1000;
    const days = Math.floor(seconds / (3600 * 24));
    seconds = seconds - days * 3600 * 24;

    const hours = Math.floor(seconds / 3600);
    seconds = seconds - hours * 3600;

    const minutes = Math.floor(seconds / 60);
    seconds = seconds - minutes * 60;

    return {
      days,
      hours,
      minutes,
      seconds: parseInt(seconds)
    };
  };
}

export function enableIframe(html = "") {
  return html.replace(/\&lt;/g, "<").replace(/\&gt;/g, ">");
}

export function parseShowcase(d) {
  const body = d.body;

  const lines = body.split("\n");

  let homePageLine = -1;
  let descriptionStartLineNumber = -1;
  let descriptionEndLineNumber = -1;
  let galleryStartLineNumber = -1;
  let galleryEndLineNumber = -1;

  for (let i = 0; i < lines.length - 1; i++) {
    const line = lines[i].trim();
    if (line.indexOf(`<!-- homepage-start -->`) >= 0) {
      homePageLine = i + 1;
    } else if (line.indexOf(`<!-- description-start -->`) >= 0) {
      descriptionStartLineNumber = i + 1;
    } else if (line.indexOf(`<!-- description-end -->`) >= 0) {
      descriptionEndLineNumber = i - 1;
    } else if (line.indexOf(`<!-- gallery-start -->`) >= 0) {
      galleryStartLineNumber = i + 1;
    } else if (line.indexOf(`<!-- gallery-end -->`) >= 0) {
      galleryEndLineNumber = i - 1;
    }
  }

  const description = [];
  const gallery = [];
  let homepage = "";

  body.split("\n").forEach((line, i) => {
    if (i === homePageLine) {
      homepage = line.trim();
    } else if (
      i >= descriptionStartLineNumber &&
      i <= descriptionEndLineNumber
    ) {
      description.push(line);
    } else if (i >= galleryStartLineNumber && i <= galleryEndLineNumber) {
      gallery.push(line);
    }
  });

  const _gallery = gallery.map(line => {
    const match = line.trim().match(/\[([^\]]+)\]\(([^\)]+)\)/im);
    if (match) {
      const name = match[1];
      const url = match[2];
      return {
        name,
        url
      };
    } else {
      return void 0;
    }
  });

  return {
    title: d.title,
    id: d.id,
    description: description.join("\n"),
    gallery: _gallery.filter(v => v),
    screenshot: _gallery.filter(v => v).map(v => v.url),
    labels: d.labels,
    homepage: homepage
  };
}
