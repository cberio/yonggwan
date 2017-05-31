import React from 'react';
import _ from 'lodash';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import { MobileInputElements } from './interface/inputMobile';
import { SearchGuest, SearchService, Selectable } from '../select';
import * as Functions from '../../.././js/common';

export class Body extends React.Component {
    render() {
        const { props } = this;
        /* *************************************
          1단계 입력 폼 :: 고객이름, 고객핸드폰번호(신규고객인경우)
        ************************************* */
        const Form1 = (
            <CSSTransitionGroup
                transitionName="service-input"
                transitionAppear={false}
                transitionLeave={false}
                transitionEnter={false}
                transitionAppearTimeout={0}
            >
                <div className="service-input">
                    <SearchGuest
                        name="customer"
                        autofocus
                        openOnFocus
                        labelKey="guest_name"
                        className="search-customer"
                        placeholder="고객님의 이름을 입력해주세요"
                        options={props.guests}
                        value={!_.isEmpty(props.schedule.guest_id) ? Functions.getGuest(props.schedule.guest_id, props.guests) : ''}
                        onChange={props.inputChangeGuest}
                        clearable={false}
                    />
                    {_.isEmpty(Functions.getGuest(props.schedule.guest_id, props.guests).guest_mobile) ? (
                        <MobileInputElements
                            value={props.temporaryScheduleObject.guest_mobile}
                            handleChange={props.inputChangePhone}
                        />
                      )
                      : ''
                    }
                </div>
            </CSSTransitionGroup>
        );


        /* *************************************
          2단계 입력 폼 :: 고객성별(필수인경우), 서비스, 시술자
        ************************************* */
        const Form2 = (
            <CSSTransitionGroup
                transitionName="service-input"
                transitionAppear={false}
                transitionLeave={false}
                transitionEnter={false}
                transitionAppearTimeout={0}
            >
                <div className="service-input">
                    <div className="radio-group">
                        <input
                            type="radio"
                            id="user-mail"
                            name="user-sex"
                            value={1}
                            autoFocus
                            onChange={props.inputChangeUserSex}
                            defaultChecked={
                              !_.isEmpty(props.schedule.guest_id) &&
                              Functions.getGuest(props.schedule.guest_id, props.guests).id == 1
                            }
                        />
                        <label htmlFor="user-mail">남성</label>
                        <input
                            type="radio"
                            id="user-femail"
                            name="user-sex"
                            value={2}
                            onChange={props.inputChangeUserSex}
                            defaultChecked={
                              !_.isEmpty(props.schedule.guest_id) &&
                              Functions.getGuest(props.schedule.guest_id, props.guests).id == 2
                            }
                        />
                        <label htmlFor="user-femail">여성</label>
                    </div>
                    <SearchService
                        selectType="searchable"
                        name="service"
                        className="search-product"
                        placeholder="상품명 검색"
                        noResultsText="일치하는 결과가 없습니다"
                        labelKey="name"
                        options={props.services}
                        autofocus={false}
                        openOnFocus
                        value={!_.isEmpty(props.schedule.shop_service_id) ? Functions.getService(props.schedule.shop_service_id, props.services) : ''}
                        onChange={props.inputChangeService}
                    />
                    <br />
                    <Selectable
                        value={!_.isEmpty(props.schedule.staff_id) ? Functions.getStaff(props.schedule.staff_id, props.staffs) : ''}
                        selectType="selectable"
                        name="epxerts"
                        className="select-expert"
                        placeholder="선택"
                        labelKey="nickname"
                        options={props.staffs}
                        onChange={props.inputChangeStaff}
                        searchable={false}
                    />
                </div>
            </CSSTransitionGroup>
        );

        return (
            <div className="new-order-body">
                <div className="service-input-wrap">
                    <h3 className={props.step === 1 ? 'active' : ''}>
                        <span className="step-index has-values">1</span>
                        <span className="step-index">1</span>
                        <button onClick={() => { props.changeStep(1); }} disabled={false}>
                          고객정보 입력
                        </button>
                    </h3>
                    <div className="service-input-inner">
                        { props.step === 1 ? Form1 : '' }
                    </div>
                </div>
                <div className="service-input-wrap">
                    <h3 className={props.step === 2 ? 'active' : ''}>
                        { props.step !== 2 && !_.isEmpty(props.schedule.shop_service_id) && !_.isEmpty(props.schedule.staff_id) ? (
                            <span className="step-index has-values">2</span>
                          ) : (
                              <span className="step-index">2</span>
                          )
                        }
                        <button onClick={() => { props.changeStep(2); }} disabled={false}>
                          서비스 선택
                        </button>
                    </h3>
                    <div className="service-input-inner">
                        { props.step === 2 ? Form2 : '' }
                    </div>
                </div>
            </div>
        )
    }
}
