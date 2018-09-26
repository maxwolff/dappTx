let ChartConfig = {   //init config for contract usage chart
    chart: {
        borderColor: '#e6e6e8',
        borderWidth: 1,
        borderRadius: 2,
        spacing: [16, 16, 16, 16]
    },
    colors: ['#54A0FF', '#1DD1A1', '#FECA57', '#FF6B6B', '#FF9FF3', '#5F27CD', '#48DBFB', '#00D2D3'],
    loading: {
        showDuration: 500,
        labelStyle: {
            fontFamily: 'IBM Plex Sans, sans-serif',
            fontSize: '16px',
            fontWeight: 400,
            color: '#54A0FF'
        },
        style: {
            opacity: .65
        }
    },
    rangeSelector: {
        buttons: [{
            type: 'week',
            count: 1,
            text: '1w'
        }, {
            type: 'week',
            count: 2,
            text: '2w'
        }, {
            type: 'month',
            count: 1,
            text: '1m'
        }],
        buttonTheme: {
            fill: '#f6f6f8',
            r: 1,
            style: {
                fontFamily: 'IBM Plex Sans, sans-serif',
                color: '#383840'
            },
            states: {
                hover: {
                    fill: '#0080ff',
                    style: {
                        color: 'white'
                    }
                },
                select: {
                    fill: '#54A0FF',
                    style: {
                        color: 'white'
                    }
                },
                disabled: {
                    fill: '#f6f6f8',
                    style: {
                        color: '#bebec0'
                    }
                }
            }
        },
        inputStyle: {
            fontFamily: 'IBM Plex Sans, sans-serif',
            color: '#383840'
        },
        inputBoxBorderColor: '#e6e6e8',
        labelStyle: {
            fontFamily: 'IBM Plex Mono, sans-serif',
            color: '#383840'
        }
    },
    navigator: {
        handles:{
            backgroundColor: '#f6f6f8',
            borderColor: '#bebec0'
        },
        margin: 8,
        maskFill: 'rgba(84,160,255,.15)',
        xAxis: {
            gridLineColor: '#bebec0',
            labels: {
                style: {
                    fontFamily: 'IBM Plex Mono, sans-serif',
                    color: '#bebec0'
                }
            },
            lineColor: '#e6e6e8'
        }
    },
    scrollbar: {
        barBackgroundColor: '#f6f6f8',
        barBorderColor: '#bebec0',
        buttonArrowColor: '#383840',
        buttonBackgroundColor: '#f6f6f8',
        buttonBorderColor: '#bebec0',
        rifleColor: '#bebec0',
        trackBackgroundColor: '#e6e6e8',
        trackBorderColor: '#e6e6e8'
    },
    tooltip: { 
        backgroundColor: 'rgba(255,255,255,.85)',
        borderRadius: 2,
        shadow: false,
        style: {
            fontFamily: 'IBM Plex Sans, sans-serif',
            color: '#383840'
        },
        xDateFormat: '%Y-%m-%d' 
    },
    xAxis: {
        crosshair: {
            color: '#bebec0'
        },
        labels: {
            style: {
                fontFamily: 'IBM Plex Mono, sans-serif',
                color: '#383840'
            }
        },
        lineColor: '#e6e6e8'
    },
    yAxis: {
        gridLineColor: '#e6e6e8',
        labels: {
            style: {
                fontFamily: 'IBM Plex Mono, sans-serif',
                color: '#383840'
            }
        }
    }
}

export default ChartConfig