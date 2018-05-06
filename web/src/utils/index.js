export function addQuestionIndex(data) {
  const toString = Object.prototype.toString;
  if(toString.call(data.page) === '[object Array]') {
    let count = 0;
    data.page.forEach(pageItem => {
      pageItem.forEach(question => {
        question.index = count++;
      })
    });
    return data;
  }
  if(toString.call(data.question) === '[object Array]') {
    data.question.map((v, i) => v.index = i + 1);
    return data;
  }
  return data;
}
