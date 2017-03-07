import React, { Component } from 'react';
import CardModal from './cardModal';
import Guider from './guider';
import { connect } from 'react-redux';
import * as actions from '../../actions';

class AsyncComponents extends Component {
  componentDidMount() {
    // init 임시로 호출함
    this.props.toggleNotifier(true);
  }
  render () {
    const CardModalComponent = (
      <CardModal
        CardType="변경"
        event={{
          "id": "1111",
          "resourceId": "B",
          "rating" : "VIP",
          "product": "남성헤어컷",
          "name": "테스트",
          "phone": "010-9389-4080",
          "start": "2017-01-30T17:30:00",
          "end": "2017-01-30T18:30:00",
          "picture": "http://gifpng.com/{52}x{52}",
          "comment": "안녕하세요",
          "comment_admin":"단골!",
          "kakao":"agcd@naver.com",
          "history":[
              {
                  "date": "2016-11-08",
                  "time": "15:00-19:00",
                  "product": "드라이",
                  "comment": "잘하고갑니다",
                  "picture" : [
                    ]
                }
            ]
          }}
        />
    )
    return (
      <div>
        {/*this.props.isModalNotifier && CardModalComponent*/}
        {/*this.props.isGuider && <Guider />*/}
      </div>
    );
  }
}

const mapStateToPops = (state) => {
  return {
    isModalNotifier: state.notifier.isModalNotifier,
    isGuider: state.guider.isGuider
  }
}
const mapDispatchToProps = (dispatch) => {
   return {
     toggleNotifier: (condition) => dispatch(actions.modalNotifier({ isModalNotifier: condition }))
   }
}

export default connect (mapStateToPops, mapDispatchToProps)(AsyncComponents);
