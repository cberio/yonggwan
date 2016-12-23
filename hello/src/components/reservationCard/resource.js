import React, { Component } from 'react';
/* images require */
import IMG_mms from '../../image/common/icon-mms.png';
import IMG_kakao from '../../image/common/icon-kakaotalk.png';
import IMG_line from '../../image/common/icon-line.png';

class Resource extends Component {
  constructor (props) {
    super(props);
    this.state = {
      currentVisibleDesription : -1
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick (i) {
    if (i === this.state.currentVisibleDesription){
      this.setState({
        currentVisibleDesription : -1
      });
    } else {
      this.setState({
        currentVisibleDesription : i
      });
    }
  }

  render () {
    const mapToThumbnail = (data) => {
      return (
        data.productPicture.map((url, i) => {
          return (
            <span className="productPicture"><img src={url} alt="시술사진" width={70} height={70}/></span>
          )
        })
      );
    }
    const mapToHistory = (history) => {
      //history.sort();
      let displayLength = 3;
      return (
        history.map((history, i) => {
          if ( i > displayLength +1 ) {
            return
          } else {
            /* [1. 메모가 없는경우] */
            if (history.comment === undefined ) {
              return (
                <li key={i} className="no-comment">
                  <div>
                    { history.date === '2016.01.01' ? <span className="date today">당일예약</span> : <span className="date">{history.date}</span> }
                    <span className="product-name">{history.product}</span>
                    <p className="comment">메모없음</p>
                  </div>
                </li>
              )
            } else {
              /* [2. 메모가 있는경우] */
                return (
                <li key={i} className={this.state.currentVisibleDesription === i ? "active" : undefined}>
                  <a href="javascript:void(0)" onClick={ () => this.handleClick(i) }>
                    <div>
                      { history.date === '2016.01.01' ? <span className="date today">당일예약</span> : <span className="date">{history.date}</span> }
                      <span className="product-name">{history.product}</span>
                      <p className="comment">{history.comment}</p>
                    </div>
                  </a>
                </li>
              )
            }
          }
        })
      )
    }
    const mapToComponent = (data) => {
      if(!data) {
        return (
          <div className="history">
            <p className="no-history">시술내역이 없습니다.</p>
          </div>
        )
      } else {
        return (
          <div className="history">
            <ul>
                { mapToHistory(data) }
            </ul>
          </div>
        )
      }
    }

    return (
        <div className="customer-detail purple">
      		<div className="head">
      			<span className="name">디자이너 홍</span>&nbsp;
      			<span className="nav">[{this.props.slideIndex +1}/10]</span>
      			<button className="btn-close ir" onClick={ () => this.props.isReservationCard() }>닫기</button>
      		</div>
      		<div className="product">
      			<div className="res-info">
      				<span className="tit">예약정보</span>
      				<span className="time">{this.props.users.phone}</span>
      			</div>
      			<div className="type">
      				<span className="tit">상품명</span>
      				<span className="service-name">{this.props.users.product}
      					<span className="service-time">1시간</span>
      				</span>
      				<span className="price">30,000
      					<span className="won">&#xFFE6;</span>
      				</span>
      			</div>
      			<div className="ui">
      				<button className="btn-delete" onClick="">삭제</button>
      				<button className="btn-edit" onClick="">수정</button>
      			</div>
      		</div>
      		<div className="customer-info clearfix">
      			<div className="info">
      				<span className="picture"><img src={this.props.users.picture} alt={this.props.users.name} /></span>
      				<span className="name">{this.props.users.name}</span>
      				<span className="phone">{this.props.users.phone}</span>
      			</div>
      			<div className="util">
      				<div className="ui">
      					<button className="btn-edit" onClick="">수정</button>
      				</div>
      				<div className="sns">
                <a href="#" target="_blank"><img src={IMG_mms} alt="MMS" title="MMS"/></a>
                {this.props.users.kakao ? <a href={this.props.users.kakao} target="_blank"><img src={IMG_kakao} alt="Kakao talk" title="카카오톡"/></a> : undefined }
      					{this.props.users.line ? <a href={this.props.users.line} target="_blank"><img src={IMG_line} alt="Line" title="라인"/></a> : undefined }
      				</div>
      			</div>
      		</div>
      		<div className="bottom">
      			<div className="tabmenu">
      				<a href="javascript:void(0)" className="active" onClick="">시술내역</a>
      				<a href="javascript:void(0)" onClick="">고객메모</a>
      			</div>
      			{mapToComponent(this.props.users.history)}
      		</div>
      		<div className="indicator">
      			<button className="prev">이전</button>
      			<input type="text" value={this.props.slideIndex +1} disabled maxLength={2}/> / <span>12</span>
      			<button className="next">다음</button>
      		</div>
      	</div>
    );
  }
}

export { Resource };
