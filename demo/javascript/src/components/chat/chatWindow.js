var React = require("react");
var SendWrapper = require('./sendwrapper');
var Notify = require('../common/notify');
var Avatar = require('../common/avatar');
var Operations = require('./operations');

module.exports = React.createClass({

    getInitialState: function () {
        var me = this;

        return {
            members: [],
            memberShowStatus: false
        };
    },

    componentWillReceiveProps: function (nextProps) {

    },

    call: function () {
        Demo.call.makeVideoCall(Demo.selected);
    },

    acceptCall: function () {
        Demo.call.acceptCall();
    },

    listMember: function () {
        if (this.refs.i.className.indexOf('up') < 0) {
            var me = this;
            if (typeof WebIM.config.isWindowSDK === 'boolean' && WebIM.config.isWindowSDK) {
                //TODO:@李宏儒 群组的聊天窗口上方的成员下拉列表
                WebIM.doQuery('{"type":"getRoster"}',
                    function success(str) {
                        //var str = '{"wenke":1,"wenke2":1}';
                        var members = eval('(' + str + ')');
                        if (members && members.length > 0) {
                            me.refreshMemberList(members);
                        }
                    },
                    function failure(errCode, errMessage) {
                        alert("listMember" + errCode);
                    });
            } else {
                Demo.conn.queryRoomMember({
                    roomId: me.props.roomId,
                    success: function (members) {
                        if (members && members.length > 0) {
                            me.refreshMemberList(members);
                        }
                    },
                    error: function () {
                    }
                });
            }
        } else {
            this.refs.i.className = 'webim-down-icon font smallest dib';
            this.setState({members: [], memberShowStatus: false});
        }
    },

    refreshMemberList: function (members) {
        this.refs.i.className = 'webim-down-icon font smallest dib webim-up-icon';
        this.setState({members: members, memberShowStatus: true});
    },
    send: function (msg) {
        Demo.conn.send(msg);
        Demo.api.appendMsg(msg, 'txt');
    },

    render: function () {
        var className = this.props.roomId ? ' dib' : ' hide',
            props = {
                sendPicture: this.props.sendPicture,
                sendAudio: this.props.sendAudio,
                sendFile: this.props.sendFile
            },
            memberStatus = this.state.memberShowStatus ? '' : ' hide',
            roomMember = [];

        for (var i = 0, l = this.state.members.length; i < l; i++) {
            var jid = this.state.members[i].jid,
                username = jid.substring(jid.indexOf('_') + 1).split('@')[0];

            roomMember.push(<li key={i}>
                <Avatar src='demo/images/default.png' />
                <span>{username}</span>
            </li>);
        }

        /*
         <p className='webim-chatwindow-title'>
         <i className={'webim-call-icon font'} onClick={this.call}>R</i>
         <i className={'webim-accept-icon font'} onClick={this.acceptCall}>R</i>
         {this.props.name}
         <i ref='i' className={'webim-down-icon font smallest' + className} onClick={this.listMember}>D</i>
         </p>
         */

        return (
            <div className={'webim-chatwindow ' + this.props.className}>
                <div className='webim-chatwindow-title'>
                    {this.props.name}
                    <i ref='i' className={'webim-down-icon font smallest' + className} onClick={this.listMember}>D</i>
                </div>
                <Operations />
                <ul ref='member' className={'webim-group-memeber' + memberStatus}>{roomMember}</ul>
                <div id={this.props.id} ref='wrapper' className='webim-chatwindow-msg'></div>
                <SendWrapper send={this.send} {...props} />
            </div>
        );
    }
});
