import React, {useEffect, useState} from 'react';
import './graph.css';
import {sendDots} from "../features/dots/dotsActions";
import {useDispatch} from "react-redux";
import Error from "./Error";

const Graph = (props) => {
    const dispatch = useDispatch()
    const [customError, setCustomError] = useState(null);
    const MIN_X = -5;
    const MAX_XY = 3;
    const MIN_Y = -3;
    const MIN_COORD = 40;
    const MAX_COORD = 280;
    const TO_RECALC_COORD = 160;
    const TO_RECALC_R = 80;
    const TO_UPDATE_TRIANGLE = 15;
    const TO_UPDATE_RECTANGLE = 29; //30
    const TO_UPDATE_CIRCLE = 15; //14

    const sendCoordClick = (x,y,r) => {
        dispatch(sendDots({x,y,r}));
    }
    function updateTriangle(r) {
        return `160,${TO_RECALC_COORD + TO_UPDATE_TRIANGLE * r}  ${TO_RECALC_COORD + TO_UPDATE_TRIANGLE * r},160 160,160`;
    }

    function updateRectangle(r) {
        return `${TO_RECALC_COORD + TO_UPDATE_RECTANGLE * r},${TO_RECALC_COORD - TO_UPDATE_RECTANGLE * r} 160,${TO_RECALC_COORD - TO_UPDATE_RECTANGLE * r} 160,160 ${TO_RECALC_COORD + TO_UPDATE_RECTANGLE * r},160`;
    }

    function updateCircle(r) {
        return `M160 160 L${TO_RECALC_COORD - TO_UPDATE_CIRCLE * r} 160 C${TO_RECALC_COORD - TO_UPDATE_CIRCLE * r} ${TO_RECALC_COORD + TO_UPDATE_CIRCLE * r} 160 ${TO_RECALC_COORD + TO_UPDATE_CIRCLE * r} 160 ${TO_RECALC_COORD + TO_UPDATE_CIRCLE * r} L 160,160 Z`;
    }

    function checkArea(x, y, r) {
        let res = false;
        if (x >= 0 && x <= r && y >= 0 && y <= r) {
            res = true;
        }
        if (x >= 0 && x <= r/2  && y <= 0 && y >= r/2) {
            res = true;
        }
        if (x >= 0 && y <= 0 && (Math.pow(x, 2) + Math.pow(y, 2) <= Math.pow(r/2, 2))) {
            res = true;
        }
        return res;
    }

    useEffect(() => {
        const svg = document.querySelector('svg');
        const handleSVGClick = (event) => {
            let x = event.clientX;
            let y = event.clientY;
            let point = svg.createSVGPoint();
            point.x = x;
            point.y = y;
            let transformedPoint = point.matrixTransform(svg.getScreenCTM().inverse());
            let tx = transformedPoint.x;
            let ty = transformedPoint.y;
            if (!((tx >= MIN_COORD && tx <= MAX_COORD) && (ty >= MIN_COORD && ty <= MAX_COORD))) {
                setCustomError('Out of the area');
                return;
            }
            const r = props.radius;
            if (r === null) {
                setCustomError('Choose R');
                return;
            }
            const toSendX = ((tx - TO_RECALC_COORD) / TO_RECALC_R * r).toFixed(5);
            const toSendY = ((TO_RECALC_COORD - ty) / TO_RECALC_R * r).toFixed(5);
            if (!(toSendX >= MIN_X && toSendX <= MAX_XY && toSendY >= MIN_Y && toSendY <= MAX_XY)) {
                setCustomError('Out of the range');
                return;
            }
            let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute("cx", transformedPoint.x);
            circle.setAttribute("cy", transformedPoint.y);
            circle.setAttribute("r", "3");
            let isHit = checkArea(toSendX, toSendY, r);
            if (isHit) {
                circle.setAttribute("fill", "blue");
            } else {
                circle.setAttribute("fill", "red");
            }
            svg.appendChild(circle);
            sendCoordClick(toSendX, toSendY, r);
        };

        // Attach the click event listener
        svg.addEventListener('click', handleSVGClick);

        // Clean up by removing the event listener when the component unmounts
        return () => {
            svg.removeEventListener('click', handleSVGClick);
        };
    }, [props.radius, dispatch]); // Add any dependencies needed


    useEffect(() => {
        let timeoutId;
        if (customError) {
            timeoutId = setTimeout(() => {
                setCustomError(null); // Reset customError after 2 seconds
            }, 2000);
        }

        return () => {
            clearTimeout(timeoutId); // Clear timeout on component unmount or change of customError
        };
    }, [customError]);

        return (
            <div className="window">
                <svg width="320" height="320" id="areas">
                    <line x1="0" y1="160" x2="320" y2="160" strokeWidth="1.6" stroke="black"/>
                    <line x1="160" y1="0" x2="160" y2="320" strokeWidth="1.6" stroke="black"/>

                    <polygon id="1" points="320,160 312,156 312,164"/>
                    <polygon id="1" points="160,0 156,8 164,8"/>
                    {/*-X */}
                    <line x1="5" y1="156" x2="5" y2="164" strokeWidth="1.6" stroke="black"/>
                    <line x1="40" y1="156" x2="40" y2="164" strokeWidth="1.6" stroke="black"/>
                    <line x1="70" y1="156" x2="70" y2="164" strokeWidth="1.6" stroke="black"/>
                    <line x1="100" y1="156" x2="100" y2="164" strokeWidth="1.6" stroke="black"/>
                    <line x1="130" y1="156" x2="130" y2="164" strokeWidth="1.6" stroke="black"/>
                    {/*+X  */}
                    <line x1="190" y1="156" x2="190" y2="164" strokeWidth="1.6" stroke="black"/>
                    <line x1="220" y1="156" x2="220" y2="164" strokeWidth="1.6" stroke="black"/>
                    <line x1="250" y1="156" x2="250" y2="164" strokeWidth="1.6" stroke="black"/>
                    <line x1="280" y1="156" x2="280" y2="164" strokeWidth="1.6" stroke="black"/>
                    <line x1="310" y1="156" x2="310" y2="164" strokeWidth="1.6" stroke="black"/>
                    <text id="capt" x="2" y="152">-5</text>
                    <text id="capt" x="32" y="152">-4</text>
                    <text id="capt" x="62" y="152">-3</text>
                    <text id="capt" x="90" y="152">-2</text>
                    <text  id="capt" x="122" y="152">-1</text>
                    <text id="capt" x="187" y="152">1</text>
                    <text  id="capt" x="217" y="152">2</text>
                    <text id="capt" x="247" y="152">3</text>
                    <text id="capt" x="277" y="152">4</text>
                    <text id="capt" x="305" y="152">5</text>
                    {/*+Y  */}
                    <line x1="156" y1="135" x2="164" y2="135" strokeWidth="1.6" stroke="black"/>
                    <line x1="156" y1="105" x2="164" y2="105" strokeWidth="1.6" stroke="black"/>
                    <line x1="156" y1="75" x2="164" y2="75" strokeWidth="1.6" stroke="black"/>
                    <line x1="156" y1="45" x2="164" y2="45" strokeWidth="1.6" stroke="black"/>
                    <line x1="156" y1="15" x2="164" y2="15" strokeWidth="1.6" stroke="black"/>
                    {/*-Y */}
                    <line x1="156" y1="185" x2="164" y2="185" strokeWidth="1.6" stroke="black"/>
                    <line x1="156" y1="215" x2="164" y2="215" strokeWidth="1.6" stroke="black"/>
                    <line x1="156" y1="245" x2="164" y2="245" strokeWidth="1.6" stroke="black"/>
                    <line x1="156" y1="275" x2="164" y2="275" strokeWidth="1.6" stroke="black"/>
                    <line x1="156" y1="305" x2="164" y2="305" strokeWidth="1.6" stroke="black"/>
                    <text x="165" y="18" id="capt">5</text>
                    <text x="165" y="48" id="capt">4</text>
                    <text x="165" y="78" id="capt">3</text>
                    <text x="165" y="108" id="capt">2</text>
                    <text x="165" y="138" id="capt">1</text>
                    <text x="165" y="190" id="capt">-1</text>
                    <text x="165" y="220" id="capt">-2</text>
                    <text x="165" y="250" id="capt">-3</text>
                    <text x="165" y="280" id="capt">-4</text>
                    <text x="165" y="310" id="capt">-5</text>

                    <path id="circle" d={updateCircle(props.radius)} fill="rgb(46,125,50)"
                          strokeWidth="1.6" stroke="black"/>
                    <polygon id="triangle" points={updateTriangle(props.radius)} fill="rgb(46,125,50)"
                             strokeWidth="1.6" stroke="black"></polygon>
                    <polygon id="square" points={updateRectangle(props.radius)} fill="rgb(46,125,50)" stroke="black"
                             strokeWidth="1.6"></polygon>
                </svg>
                {customError && <Error>{customError}</Error>}
            </div>
        );
    };

    export default Graph;