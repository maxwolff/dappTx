import React, { Component } from 'react'
import AppBar from '../components/AppBar'
import Sidebar from '../components/Sidebar'
import StockChart from '../components/StockChart'
import ChartConfig from '../components/ChartConfig'
import axios from 'axios'
import { cloneDeep } from 'lodash'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

class Home extends Component {
    constructor(props) {
        super(props)

        this.state = {
            address: '',
            exampleAddress: '0x06012c8cf97BEaD5deAe237070F9587f8E7A266d',
            volConfig: cloneDeep(ChartConfig),
            fnConfig: cloneDeep(ChartConfig),
            isEmpty: true,
            isLoading: false,
            sidebar: 'closed',
            threwError: false
        }

        this.volChart = React.createRef()    //chart component refs for imperative loading animations
        this.fnChart = React.createRef()
    }

    callApi = async newAddress => {
        const startDate = new Date()
        startDate.setMonth(startDate.getMonth()-1) // pull one month of data
        const startTime = '/0x' + Math.round(startDate.getTime() / 1000.0).toString(16) // hex conversion
        const endTime = '/0x' + Math.round(Date.now() / 1000.0).toString(16)    //convert current time to hex timestamp

        const url = '/api/' + newAddress + startTime + endTime
        console.log(url)

        axios.get(url, { timeout: 10000 }).then(response => {   //call API with URL to get data
            const data = response.data
            if (!Object.keys(data).length) {
                const newVolConfig = cloneDeep(this.state.volConfig)    //create new chart configs with fetched data
                newVolConfig.series = []
                const newFnConfig = cloneDeep(this.state.fnConfig)
                newFnConfig.series = []

                this.setState({
                    volConfig: newVolConfig,    //update charts with new configs
                    fnConfig: newFnConfig,
                })
                throw (new Error('No data found'))
            }

            const volData = Object.keys(data).map(elem => {   //map contract data for chart series config
                const epoch = Math.round(new Date(elem).getTime())
                const pct = 100.0 * data[elem]['contractTx'] / data[elem]['sampledEthTx']
                return [epoch, pct]
            })

            const volSeries = [{
                data: volData,
                name: 'Volume',
                tooltip: {
                    valueDecimals: 2,
                    valueSuffix: '%'
                }
            }]

            const fnSeries = Object.keys(data).reduce((series, elem) => {   //reduce function data for chart series config
                const epoch = Math.round(new Date(elem).getTime())
                Object.keys(data[elem].functions).reduce((arr, func) => {
                    const index = series.findIndex(series => series['name'] === func)
                    if (index < 0) {
                        series.push({
                            data: [[epoch, data[elem].functions[func]]],
                            name: func,
                            showInNavigator: true
                        })
                        return series
                    }
                    else {
                        series[index].data.push([epoch, data[elem].functions[func]])
                        return series
                    }
                }, [])
                return series
            }, [])

            const newVolConfig = cloneDeep(this.state.volConfig)    //create new chart configs with fetched data
            newVolConfig.series = volSeries
            const newFnConfig = cloneDeep(this.state.fnConfig)
            newFnConfig.series = fnSeries

            this.setState({
                volConfig: newVolConfig,    //update charts with new configs
                fnConfig: newFnConfig,
                isLoading: false,
                threwError: false
            })

            this.volChart.current.hideLoading()     //hide loading states post-render
            this.fnChart.current.hideLoading()

        }).catch(error => {
            console.log(error)
            this.setState({
                isLoading: false,
                threwError: true
            })
            this.volChart.current.showLoading(error.message)    //display error messages in chart
            this.fnChart.current.showLoading(error.message)
        })
    }

    renderAddress = newAddress => {
        if (!this.state.isLoading) {
            this.volChart.current.showLoading()     //trigger loading states before rerender
            this.fnChart.current.showLoading()

            this.setState({
                address: newAddress,    //update address bar, remove chart empty state
                isEmpty: false,
                isLoading: true,
                sidebar: 'closed'
            })

            this.callApi(newAddress)   //get chart data for a new address
        }
    }

    loadExample = event => {
        event.preventDefault()
        if (!this.state.isLoading) {
            this.renderAddress(this.state.exampleAddress)
        }
    }

    toggleSidebar = event => {
        if (!this.state.isLoading) {
            this.setState((prevState, props) => {
                    return ({
                        sidebar: prevState.sidebar === 'open' ? 'closed' : 'open',
                        isLoading: false,
                        isEmpty: prevState.isEmpty || prevState.threwError ? true : false,
                        threwError: false
                    })
            })
        }
    }

    render() {
        return (
            <ReactCSSTransitionGroup transitionName="AppContainer" transitionAppear={true} transitionAppearTimeout={5000} transitionEnterTimeout={5000} transitionLeaveTimeout={5000}>
                <div key={'AppContainer'} className="app-container">
                    <ReactCSSTransitionGroup transitionName="AppBar" transitionAppear={true} transitionAppearTimeout={5000} transitionEnterTimeout={5000} transitionLeaveTimeout={5000}>
                        <AppBar key={AppBar} address={this.state.address} enterAddress={this.renderAddress} toggleSidebar={this.toggleSidebar} />
                    </ReactCSSTransitionGroup>
                    <Sidebar sidebar={this.state.sidebar} loadExample={this.loadExample} />
                    <main className={'charts ' + this.state.sidebar + 'Sidebar'}>
                        <ReactCSSTransitionGroup transitionName="FnChart" transitionAppear={true} transitionAppearTimeout={5000} transitionEnterTimeout={5000} transitionLeaveTimeout={5000}>    
                            <StockChart key={'FnChart'} ref={this.fnChart} config={this.state.fnConfig} title="Contract Function Calls" isEmpty={this.state.isEmpty} isLoading={this.state.isLoading} loadExample={this.loadExample} threwError={this.state.threwError} />
                        </ReactCSSTransitionGroup>
                        <ReactCSSTransitionGroup transitionName="VolChart" transitionAppear={true} transitionAppearTimeout={5000} transitionEnterTimeout={5000} transitionLeaveTimeout={5000}>
                            <StockChart key={'VolChart'} ref={this.volChart} config={this.state.volConfig} title="Contract Volume" subtitle="(percentage of sampled Ethereum transactions)" isEmpty={this.state.isEmpty} isLoading={this.state.isLoading} loadExample={this.loadExample} threwError={this.state.threwError} />
                        </ReactCSSTransitionGroup>
                    </main>
                </div>
            </ReactCSSTransitionGroup>
        )
    }
}
export default Home