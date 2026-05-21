const KEYWORDS = [
  "SELECT","FROM","WHERE","AND","OR","NOT","IN","BETWEEN","LIKE","IS","NULL",
  "ORDER","BY","GROUP","HAVING","LIMIT","OFFSET","DISTINCT","AS","ON","JOIN",
  "INNER","LEFT","RIGHT","FULL","OUTER","CROSS","SELF","UNION","ALL","WITH","RECURSIVE",
  "INSERT","INTO","VALUES","UPDATE","SET","DELETE","TRUNCATE","CREATE","REPLACE","VIEW",
  "INDEX","DROP","TABLE","EXPLAIN","START","TRANSACTION","COMMIT","ROLLBACK",
  "CASE","WHEN","THEN","ELSE","END","IF","EXISTS","ANY","SOME","DATE","INTERVAL","DAY","MONTH","YEAR",
  "OVER","PARTITION","ASC","DESC","COALESCE","USING"
];

const FUNCS = [
  "COUNT","SUM","AVG","MIN","MAX","CONCAT","CONCAT_WS","LENGTH","CHAR_LENGTH","SUBSTRING","SUBSTR","MID",
  "UPPER","LOWER","UCASE","LCASE","TRIM","NOW","CURDATE","CURTIME","DATEDIFF","DATE_ADD","DATE_SUB",
  "DATE_FORMAT","LOCATE","INSTR","ROW_NUMBER","RANK","DENSE_RANK","NTILE","LAG","LEAD","COALESCE"
];

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function highlightSQL(sql: string): string {
  const safe = esc(sql);

  // strings (single-quoted)
  let out = safe.replace(/'([^']*)'/g, (_m, g1) => `<span class="sql-str">'${g1}'</span>`);

  // numbers
  out = out.replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="sql-num">$1</span>');

  // comments -- ... end of line
  out = out.replace(/(--[^\n]*)/g, '<span class="sql-com">$1</span>');

  // functions (must come before keywords to win for shared words like COUNT)
  const funcRe = new RegExp(`\\b(${FUNCS.join("|")})\\b`, "gi");
  out = out.replace(funcRe, '<span class="sql-fn">$1</span>');

  // keywords
  const kwRe = new RegExp(`\\b(${KEYWORDS.join("|")})\\b`, "gi");
  out = out.replace(kwRe, '<span class="sql-kw">$1</span>');

  return out;
}
