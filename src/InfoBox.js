import React from 'react'
import './InfoBox.css'
import {Card,CardContent, Typography} from '@material-ui/core'
import { act } from 'react-dom/cjs/react-dom-test-utils.production.min'

function InfoBox({title,isRed, cases,total,active, ...props}) {
    return (
        <Card  
            onClick={props.onClick}
            //if the info box is active add the classname info-box-selected
            className={`info-box ${isRed && 'info-box-red'} ${active && 'info-box-selected'} `}>
            <CardContent>
                <Typography className='info-box-title' color='textSecondary'>
                    {title}
                </Typography>

                <div className="info-box-cases">{cases}</div>

                <Typography className='info-box-total' color='textSecondary'>
                    {total}
                </Typography>
            </CardContent>  
        </Card>
    )
}

export default InfoBox
