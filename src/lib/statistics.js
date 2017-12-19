/**
 * Created by axetroy on 17-5-20.
 */
import React, { Component } from 'react';
import firebase from './firebase';

// 访客统计
function visitorsTrack() {
  const track = firebase.database().ref('track/history');
  const trackRef = track.push();
  trackRef.set({
    href: window.location.href,
    ip: '',
    userAgent: window.navigator.userAgent,
    language: window.navigator.language,
    date: new Date().toString(),
  });
}

// 统计总站总共访问了多少次
function totalVisited() {
  const visited = firebase.database().ref('statistics/visited/total');
  visited.once('value', function(data) {
    let value = data.val();
    if (!value) {
      visited.set(1);
    } else {
      visited.set(value + 1);
    }
  });
}

export default function Statistics(ComponsedComponent) {
  return class extends Component {
    constructor(props) {
      super(props);
    }

    componentDidMount() {
      if (process.env.NODE_ENV === 'production') {
        visitorsTrack();
        totalVisited();
      }
    }

    render() {
      return <ComponsedComponent {...this.props} {...this.state} />;
    }
  };
}
