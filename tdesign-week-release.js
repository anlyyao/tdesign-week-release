const fs = require('fs');

// 指定的时间范围
const START_DATE = process.argv[process.argv.indexOf('--START_DATE') + 1];
const END_DATE = process.argv[process.argv.indexOf('--END_DATE') + 1];

const projectName = [
  'tdesign-vue',
  'tdesign-vue-next',
  'tdesign-react',
  'tdesign-miniprogram',
  'tdesign-mobile-vue',
  'tdesign-mobile-react',
  'tdesign-flutter/tdesign-site',
];
const projectDesc = {
  'tdesign-vue': '## Vue2 for Web 发布',
  'tdesign-vue-next': '## Vue3 for Web 发布',
  'tdesign-react': '## React for Web 发布 ',
  'tdesign-miniprogram': '## Miniprogram for WeChat 发布',
  'tdesign-mobile-vue': '## Vue3 for Mobile 发布',
  'tdesign-mobile-react': '## React for Mobile 发布',
  'tdesign-flutter/tdesign-site': '## Flutter for Mobile 发布',
};

// 使用正则表达式提取版本标题行，确保以"##"开头并以日期结尾
const versionRegex = /^##.+?`\d{4}-\d{2}-\d{2}`\s*$/gm;

function getVersionContent(version, markdown) {
  const regex = new RegExp(`(${version}.*?(?=## 🌈|$))`, 's');
  const match = markdown.match(regex);

  if (match) {
    return match[0];
  } else {
    return 'Version Content not found';
  }
}

function getTagVersion(text) {
  const regex = /(\d+\.\d+\.\d+)/;
  const match = text.match(regex);

  if (match) {
    return match[0];
  } else {
    return 'Version number not found';
  }
}

function getProjecDesc(project, tag, prefixDesc, suffixDesc) {
  return [
    `${prefixDesc} [${tag}](https://github.com/Tencent/${project}/releases/tag/${tag})`,
    `${suffixDesc} https://github.com/Tencent/${project}/releases/tag/${tag}`,
  ];
}

projectName.forEach((project) => {
  // 读取 CHANGELOG.md 文件内容
  const changelogContent = fs.readFileSync(`./${project}/CHANGELOG.md`, 'utf8');
  const versions = changelogContent.match(versionRegex);

  let output = '';

  versions.forEach((versionLine) => {
    const versionContent = getVersionContent(versionLine, changelogContent);
    const dateMatch = versionLine.match(/\d{4}-\d{2}-\d{2}/);
    const tag = getTagVersion(versionLine);
    if (dateMatch) {
      const date = new Date(dateMatch[0]);
      // 检查日期是否在指定范围内,[2024-06-01, 2024-06-07] 闭区间
      if (date >= new Date(START_DATE) && date <= new Date(END_DATE)) {
        const descs = getProjecDesc(project, tag, projectDesc[project], '详情见：');
        output += descs[0] + '\n' + versionContent + '\n' + descs[1] + '\n';
      }
    }
  });

  // 保存
  fs.appendFileSync(`./week-release/${START_DATE}_${END_DATE}.md`, output, 'utf8');
});

/**
 * @description 命令行执行 node tdesign-week-release.js -- --START_DATE 2024-06-01 --END_DATE 2024-06-07
 */
