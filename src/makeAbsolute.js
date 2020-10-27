export default function(path) {
    if (/^https?:\/\//i.test(path)) return path;
    return window.location.origin + "/" + path.replace(/^\//, "");
  }
