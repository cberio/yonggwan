import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import $ from 'jquery';
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import '../../../css/advise.css';

let setAdviseStart;

class Advise extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            animationStatus: '' // 'S'(init) || 'R'(patching) || 'E'(success)
        }
        this.setAnimationStatus = this.setAnimationStatus.bind(this);
        this.close = this.close.bind(this);
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
        const component = this;
        
        if(nextProps.condition) {
            component.setAnimationStatus('S');
            setAdviseStart = setTimeout(() => {
                if (component.state.animationStatus === 'S')
                    component.setAnimationStatus('R');
            }, 2400);
        }

        if(!this.props.success && nextProps.success) {
            this.setAnimationStatus('E');
        }
    }

    componentWillUnmount() {
        clearInterval(setAdviseStart);
    }

    setAnimationStatus(status) {
        this.setState({
            animationStatus: status
        })
    }

    close() {
        const component = this;
        $('.advise-wrap').removeClass('slideInUp').addClass('slideOutDown');
        setTimeout(() => {
            component.props.advise({ condition: false });
        }, 600);
    }

    render() {

        const svgAttributes = {
            xmlnsXlink: 'http://www.w3.org/1999/xlink',
            xmlns: 'http://www.w3.org/2000/svg',
            shapeRendering: 'geometricPrecision',
            textRendering: 'geometricPrecision',
            viewBox: '0 0 16 16',
            style: { whiteSpace: 'pre' }
        };

        const animationStart = (
            <g id="loding_start" opacity={1} transform="translate(8,8) translate(-7,-1.5)" style={{ animation: 'loding_start_t 1s linear both' }}>
                <ellipse rx="1.5" ry="1.5" fill="#f5f5f5" stroke="none" opacity={1} transform="translate(7,1.5) translate(-5.5,0)" style={{ animation: 'a0_t 2.4s linear 0.2s both' }} />
                <ellipse rx="1.5" ry="1.5" fill="#f5f5f5" stroke="none" opacity={1} transform="translate(7,1.5) translate(5.5,0)" style={{ animation: 'a1_t 2.2s linear 0.4s both' }} />
                <ellipse rx="1.5" ry="1.5" fill="#f5f5f5" stroke="none" opacity={1} transform="translate(7,1.5) translate(-5.5,0)" style={{ animation: 'a2_t 2s linear 0.6s both' }} />
                <ellipse rx="1.5" ry="1.5" fill="#f5f5f5" stroke="none" opacity={1} transform="translate(7,1.5) translate(5.5,0)" style={{ animation: 'a3_t 2.6s linear both' }} />
            </g>
        );

        const animationRepeat = (
            <g id="loding_repeat" opacity={1} transform="translate(8,8) translate(-7,-1.5)" style={{ animation: 'loding_repeat_t 1s linear both' }}>
                <ellipse rx="1.5" ry="1.5" fill="#f5f5f5" stroke="none" opacity={1} transform="translate(7,1.5) rotate(1082.59) translate(-5.5,0)" style={{ animation: 'a0_t 1.4s infinite linear both' }} />
                <ellipse rx="1.5" ry="1.5" fill="#f5f5f5" stroke="none" opacity={1} transform="translate(7,1.5) rotate(994.44) translate(5.5,0)" style={{ animation: 'a1_t 1.4s infinite linear both' }} />
                <ellipse rx="1.5" ry="1.5" fill="#f5f5f5" stroke="none" opacity={1} transform="translate(7,1.5) rotate(902.21) translate(-5.5,0)" style={{ animation: 'a2_t 1.4s infinite linear both' }} />
                <ellipse rx="1.5" ry="1.5" fill="#f5f5f5" stroke="none" opacity={1} transform="translate(7,1.5) rotate(1170) translate(5.5,0)" style={{ animation: 'a3_t 1.4s infinite linear both' }} />
            </g>
        )

        const animationEnd = (
            <g transform="translate(8,9.95658) translate(-7,-4.16843)">
                <g id="ending" opacity={1} transform="translate(7,2.21185) translate(-7,-1.5)" style={{ animation: 'ending_t 0.6s linear 0.4s both' }}>
                    <ellipse rx="1.5" ry="1.5" fill="#f5f5f5" stroke="none" opacity={1} transform="translate(7,1.5) rotate(1710) translate(-5.5,0)" style={{ animation: 'a0_t 0.6s linear both' }} />
                    <ellipse rx="1.5" ry="1.5" fill="#f5f5f5" stroke="none" opacity={1} transform="translate(7,1.5) rotate(1620) translate(5.5,0)" style={{ animation: 'a1_t 0.6s linear both' }} />
                    <ellipse rx="1.5" ry="1.5" fill="#f5f5f5" stroke="none" opacity={1} transform="translate(7,1.5) rotate(1530) translate(-5.5,0)" style={{ animation: 'a2_t 0.6s linear both' }} />
                    <ellipse rx="1.5" ry="1.5" fill="#f5f5f5" stroke="none" opacity={1} transform="translate(7,1.5) rotate(1800) translate(5.5,0)" style={{ animation: 'a3_t 0.6s linear both' }} />
                </g>
                <path d="M0,0C-3.5,3.5,-10.5,3.5,-14,0" stroke="#f5f5f5" fill="none" strokeWidth="1.5" strokeMiterlimit={1} strokeLinecap="round" strokeDashoffset="15.239999999999998" strokeDasharray="15.24" transform="translate(14,5.71185)" style={{ animation: 'a4_do 0.4s linear 0.6s both' }} />
            </g>
        )

        return (
            <div className={`advise-wrap${this.props.condition ? ' slideInUp' : ' slideOutDown'}`}>
                <div className="advise-container">
                    <div className="advise">
                        <div className="smile">
                            <svg {...svgAttributes}>
                                {
                                 this.state.animationStatus === 'S' ? animationStart :
                                 this.state.animationStatus === 'R' ? animationRepeat :
                                 this.state.animationStatus === 'E' ? animationEnd : ''
                                }
                            </svg>
                        </div>
                        {this.props.success && (
                            <div className="contents">
                                {!_.isEmpty(this.props.htmls) && this.props.htmls.map((html, i) => (
                                    <span className={!_.isEmpty(html.classes) ? html.classes.join(' ') : ''} key={`key_${i}`}>
                                        {html.text}
                                    </span>
                                ))}
                            </div>
                          )
                        }
                        {this.props.success && (
                                <div className="ui">
                                    <button className="close" onClick={this.close}>닫기</button>
                                    {!_.isEmpty(this.props.buttons) && this.props.buttons.map((button, i) => (
                                        <button className={!_.isEmpty(button.classes) ? button.classes.join(' ') : ''} onClick={button.click} autoFocus={button.autoFocus} key={`key_${i}`}>
                                            {button.text}
                                        </button>
                                    ))}
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        );
    }
}

Advise.propTypes = {
    condition: PropTypes.bool,
    success: PropTypes.bool,
    htmls: PropTypes.array,
    buttons: PropTypes.array
};

Advise.defaultProps = {
    condition: false,
    success: false,
    htmls: [],
    buttons: []
};

const mapStateToProps = state => ({
    ...state.advise
})

const mapDispatchToProps = dispatch => ({
    advise: options => dispatch(actions.advise(options))
});

export default connect(mapStateToProps, mapDispatchToProps)(Advise);
