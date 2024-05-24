const pb = {
    le: '<:le:1243280454757388381>',
    me: '<:me:1243280459580968981>',
    re: '<:re:1243280464278585434>',
    lf: '<:lf:1243280457206861864>',
    mf: '<:mf:1243280461921521734>',
    rf: '<:rf:1243280466514022400>',
  };
   
  function formatResults(upvotes = [], downvotes = []) {
    const totalVotes = upvotes.length + downvotes.length;
    const progressBarLength = 14;
    const filledSquares = Math.round((upvotes.length / totalVotes) * progressBarLength) || 0;
    const emptySquares = progressBarLength - filledSquares || 0;
   
    if (!filledSquares && !emptySquares) {
      emptySquares = progressBarLength;
    }
   
    const upPercentage = (upvotes.length / totalVotes) * 100 || 0;
    const downPercentage = (downvotes.length / totalVotes) * 100 || 0;
   
    const progressBar =
      (filledSquares ? pb.lf : pb.le) +
      (pb.mf.repeat(filledSquares) + pb.me.repeat(emptySquares)) +
      (filledSquares === progressBarLength ? pb.rf : pb.re);
   
    const results = [];
    results.push(
      `👍 ${upvotes.length} upvotes (${upPercentage.toFixed(1)}%) • 👎 ${
        downvotes.length
      } downvotes (${downPercentage.toFixed(1)}%)`
    );
    results.push(progressBar);
   
    return results.join('\n');
  }
   
  module.exports = formatResults;