let ChartConfig = {   //init config for contract usage chart
    chart: {
    borderColor: '#e6e6e8',
    borderWidth: 1,
    borderRadius: 2,
    spacing: [16,16,16,16]
    },
    colors: ['#54A0FF', '#1DD1A1', '#FECA57', '#FF6B6B', '#FF9FF3', '#5F27CD', '#48DBFB', '#00D2D3'],
    loading: {
    showDuration: 500,
    labelStyle: {
        fontFamily: 'IBM Plex Mono, sans-serif',
        fontWeight: 400,
        color: '#0080ff'
    }
    },
    rangeSelector: {
    buttonTheme: {
        fill: '#f6f6f8',
        r: 1,
        style: {
        fontFamily: 'IBM Plex Mono, sans-serif',
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
        }
        }
    },
    inputStyle: {
        fontFamily: 'IBM Plex Mono, sans-serif',
        color: '#383840'
    },
    inputBoxBorderColor: '#e6e6e8',
    labelStyle: {
        fontFamily: 'IBM Plex Mono, sans-serif',
        color: '#383840'
    }
    },
    scrollbar: {
    barBackgroundColor: '#f6f6f8',
    barBorderColor: 'e6e6e8',
    buttonArrowColor: '#383840',
    buttonBackgroundColor: '#f6f6f8',
    buttonBorderColor: '#e6e6e8',
    trackBackgroundColor: '#e6e6e8',
    trackBorderColor: '#e6e6e8'
    },
    series: [
    {
    data: [], 
    name: 'Volume',
    tooltip: {
            valueDecimals: 2,
            valueSuffix: '%'
        }
    }],
    tooltip: {xDateFormat: '%Y-%m-%d'},
    xAxis: {
    labels: {
        style: {
        fontFamily: 'IBM Plex Mono, sans-serif',
        color: '#383840'
        }
    },
    lineColor: 'white'
    },
    yAxis: {
    labels: {
        style: {
        fontFamily: 'IBM Plex Mono, sans-serif',
        color: '#383840'
        }
    }
    }
}

export default ChartConfig