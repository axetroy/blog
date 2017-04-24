/**
 * Created by axetroy on 17-4-6.
 */
import React, { Component } from 'react';
import { Tooltip } from 'antd';
import GithubColors from '../../lib/github-colors.json';

function values(obj) {
  let result = [];
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      result = result.concat([obj[key]]);
    }
  }
  return result;
}

function sum(array) {
  let result = 0;
  for (let key in array) {
    if (array.hasOwnProperty(key)) {
      result = result + (array[key] || 0);
    }
  }
  return result;
}

class GithubLangIngredient extends Component {
  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    let { languages } = this.props;

    languages = languages || {};

    if (Object.keys(languages).length === 0) languages = { Unkown: 1 };

    const languagesNameArray = Object.keys(languages);
    const languagesIngredientArray = values(languages);
    const totalCodeAmount = sum(languagesIngredientArray);

    return (
      <div style={{ display: 'table', width: '100%', height: '1rem' }}>
        {languagesNameArray.map((language, i) => {
          const codeAmount = languagesIngredientArray[i];
          const percent = (codeAmount / totalCodeAmount * 100).toFixed(2);
          const bgColor = (GithubColors[language] || {}).color || '#e6e6e6';
          return (
            <Tooltip
              key={language}
              placement="topLeft"
              title={
                <span>
                  <span
                    className="repo-language-color mr5"
                    style={{
                      backgroundColor: bgColor
                    }}
                  />
                  {language}: {percent}%
                </span>
              }
            >
              <span
                style={{
                  display: 'table-cell',
                  width: percent + '%',
                  backgroundColor: bgColor,
                  transition: 'all 1s'
                }}
              />
            </Tooltip>
          );
        })}
      </div>
    );
  }
}
export default GithubLangIngredient;

