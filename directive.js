module.exports = class Directive {
    constructor() {
        this.type = 'AudioPlayer.Play'
        this.audioItem = {
            'stream': {
                'url': '',
                'offsetInMilliseconds': 0,
                'progressReport': {
                    'progressReportDelayInMilliseconds': 0,
                    'progressReportIntervalInMilliseconds': 0
                },
                'token': '',
                'expectedPreviousToken': ''
            },
            'metadata': {}
        }
    }
}