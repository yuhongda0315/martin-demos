/**
 * 初始化数据模型可以得到如下模型：
 * @namespace RongDataModel
 * @property {object}  User         - {@link User} 
 * @property {object}  Group        - {@link Group} 
 * @property {object}  Friend       - {@link Friend} 
 * @property {object}  Conversation - {@link Conversation} 
 * @property {object}  Message      - {@link Message} 
 * @property {object}  Status       - {@link Status} 
 */

"use strict";
(function(win, RongIMLib, RongIMClient) {
    var option = (function() {
        return {
            max_msg_count: 20,
            max_conversation_count: 50,
            get_historyMsg_count: 5,
            // 接口测试服务
            server_path: 'http://10.10.112.167:3587/',
            data:['User', 'Group', 'Friend']
        };
    })();

    /** 工具类 */
    var forEach = function(object, callback) {
        for (var key in object) {
            callback(key, object[key]);
        }
    };
    var loop = function(arrs, callback) {
        for (var i = 0, len = arrs.length; i < len; i++) {
            callback(arrs[i]);
        }
    };
    var currentUserId = "";
    var getPrototype = Object.prototype.toString;
    var events = {}; // 事件存储格式:events.MessageWatcher : [fun1, fun2]
    var emit = function(name, data) {
        if (name in events) {
            for (var i = 0, len = events[name].length; i < len; i++) {
                events[name][i](data);
            }
        }
    };
    var watcher = function(name, func) {
        if (typeof func != 'function' || typeof name != 'string') return;
        events[name] = events[name] || [];
        events[name].push(func);
    };
    var destroy = function(name) {
        delete events[name];
    };

    var request = function(url, data, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    callback(JSON.parse(xhr.responseText));
                }
            }
        };
        url = option.server_path + url;
        xhr.open('GET', url, true);
        xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
        xhr.send(data);
    };
    var jsonStringify = function(obj) {
        return JSON.stringify(obj);
    };
    // 数据格式:var user = {zhangsan:{id:'zhangsan',name:'name'}};
    var userFormat = function(data, callback) {
        for (var i = 0, len = data.length; i < len; i++) {
            var user = data[i].user,
                obj = {};
            obj[user.id] = user;
            callback(obj);
        }
    };

    /**
       @namespace User
    */

    /**
        用户模型数据接口
        @namespace UserProvider
    */

    /**
     * 请求数据 url, 如果你用到用户模块，可以以根据下面的 url 进行重写服务。
     * @memberof UserProvider
     * @enum {string}
     */
    var userPath = {
        /** 获取全部用户信息 */
        all: 'user/all',
        /** 获取用户信息 */
        get: 'user/{userId}',
        /** 修改用户信息 */
        upate: 'user/{userId}/update',
        /** 登录 */
        login: 'user/login'
    };
    /**
        @memberof User
     */
    var UserDataProvider = {
        /** 
         *   获取用户信息
         *   @memberof UserProvider 
         *   @param {string}     userId      - 用户 Id 
         *   @param {function}   callback    - 函数回调
         */
        get: function(userId, callback) {
            //TODO 
            var data = {
                name: '陌生人',
                portraitUri: 'http://7xogjk.com1.z0.glb.clouddn.com/Uz6Sw8GXx1476068767254905029'
            };
            var user = {};
            user[userId] = user;
            callback(user);
        },
        /** 
         *   获取全部用户信息
         *   @memberof UserProvider 
         *   @param {function}   callback    - 函数回调
         */
        getAll: function(callback) {
            request(userPath.all, null, function(data) {
                callback(data.result);
            });
        },
        /** 
         *   修改用户信息
         *   @memberof UserProvider 
         *   @param {array|string}     users       - 用户或者用户数组
         *   @param {function}         callback    - 函数回调
         */
        update: function(users, callback) {
            callback(users);
        },
        login: function(info, callback) {
            request(userPath.login, jsonStringify(info), callback);
        }
    };

    var User = (function(userProvider) {
        var data = {};
        /** 
         *   登录
         *   @memberof User 
         *   @param {object}     info     - 登录所需对象
         *   @param {string}     info.password - 密码
         *   @param {string}     info.phone - 手机号
         *   @param {string}     info.region - 号码区域标识
         *   @param {function}   callback - 登录结果在 callback 中返回
         *   @see {@link UserProvider}
             @example
             var _instance = RongDataModel.init({appkey:'appkey'});
             var info = {
                password:"admin000", 
                phone:"13269772769", 
                region:"86"
             };
             _instance.User.login(userIds, function(result){
                // result => {code:200, resut:{id:'userId', token:'token'}}
             });
         */
        var login = function(info, callback) {
            userProvider.login(info, callback);
        };
        /** 
         *   修改用户信息
         *   @memberof User 
         *   @param {array|string}     users   - 用户或者用户数组
         *   @see {@link UserProvider} 
         *   @example
             var _instance = RongDataModel.init({appkey:'appkey'});
             var user = {id:'userId', name:'username', portraitUri:'http://xxx.xxx.com/portait.png'};
             _instance.User.set(user);
         */
        var set = function(userIds) {
            userProvider.update(users, function(result) {
                forEach(result, function(userId, user) {
                    data[userId] = user;
                });
            });
        };
        /** 
         *   获取用户信息
         *   @memberof User 
         *   @param {string}     userId   - 用户 Id
         *   @param {function}   callback - 用户信息在 callback 中返回
         *   @see {@link UserProvider}
             @example
             var _instance = RongDataModel.init({appkey:'appkey'});
             var userId = 'xxx';
             _instance.User.get(userId, function(user){
                // user: 用户信息
             });
         */
        var get = function(userId, callback) {
            if (userId in data) {
                callback(data[userId]);
            } else {
                userProvider.get(userId, function(result) {
                    forEach(result, function(userId, user) {
                        data[userId] = user;
                        callback(user);
                    });
                });
            }
        };
        /** 
         *   获取全部用户, 此方不从服务器获取用户信息
         *   返回值数据格式 var users = {userId1:{id:'userId1',name:'name'}};
         *   @memberof User 
         *   @param {array}      userIds - 用户 Id 数组
         *   @param {function}   callback - 用户信息在 callback 中返回
         *   @see {@link UserProvider}
             @example
             var _instance = RongDataModel.init({appkey:'appkey'});
             var userIds = ['userId1', 'userId2'];
             _instance.User.getUsers(userIds, function(users){
                // users 用户信息
                // 数据接口 {userId1:{id:'userId1',name:'name'}, userId2:{id:'userId2',name:'name'}}
             });
         */
        var getUsers = function(userIds, callback) {
            var users = {};
            for (var i = 0, len = userIds.length; i < len; i++) {
                userIds[i] in data && (users[userIds[i]] = data[userIds]);
            }
            callback(users);
        };
        var _push = function(userId, user) {
            data[userId] = user;
        };
        watcher('User', function(data) {
            forEach(data, function(userId, user) {
                _push(userId, user);
            });
        });

        watcher('Pull_User', function() {
            UserDataProvider.getAll(function(data) {
                emit('User', data);
            });
        });
        return {
            login: login,
            set: set,
            get: get,
            getUsers: getUsers,
            data: data,
            UserDataProvider: userProvider
        };
    })(UserDataProvider);
    /** User DataModel end region */

    /** Friend DataModel region */

    /**
     *  @namespace Friend
     */

    /**
     * 好友模型数据接口
     * @namespace FriendProvider
     */

    /**
     * 请求数据 url, 如果你用到好友模块，可以以根据下面的 url 进行重写服务。
     * @memberof FriendProvider
     * @enum {string}
     */
    var friendPath = {
        /** 获取好友列表 */
        all: 'friendship/all',
        /** 申请加好友 */
        invite: 'friendship/invite',
        /** 同意加好友 */
        agree: 'friendship/agree',
        /** 忽略加好友请求 */
        ignore: 'friendship/ignore',
        /** 删除好友 */
        remove: 'friendship/delete',
        /** 设置好友备注 */
        setDisplayName: 'friendship/set_display_name'
    };

    var FriendDataProvider = {
        /** 
         * 请求加要好友  
         * @memberof FriendProvider 
         * @param {string}     friendId - 好友 Id 
         * @param {function}   callback - 邀请结果在 callback 中返回
         */
        invite: function(friendId, callback) {
            var data = {
                friendId: friendId
            };
            result(friendPath.invite, jsonStringify(data), callback);
        },
        /** 
         * 获取全部好友列表  
         * @memberof FriendProvider 
         * @param {function}   callback - 好友列表在 callback 中返回
         */
        getAll: function(callback) {
            request(friendPath.all, null, callback);
        },
        /** 
         * 同意加好友  
         * @memberof FriendProvider 
         * @param {string}     friendId - 好友 Id 
         * @param {function}   callback - 同意结果 callback 中返回
         */
        agree: function(friendId, callback) {
            var data = {
                friendId: friendId
            };
            result(friendPath.agree, jsonStringify(data), callback);
        },
        /** 
         * 忽略加好友请求  
         * @memberof FriendProvider 
         * @param {string}     friendId - 好友 Id 
         * @param {function}   callback - 忽略 callback 中返回
         */
        ignore: function(friendId, callback) {
            var data = {
                friendId: friendId
            };
            result(friendPath.ignore, jsonStringify(data), callback);
        },
        /** 
         * 设置好友备注名称  
         * @memberof FriendProvider 
         * @param {string}     friendId - 好友 Id 
         * @param {string}     displayName - 备注名称
         * @param {function}   callback -  返回结果
         */
        setDisplayName: function(friendId, displayName, callback) {
            var data = {
                friendId: friendId,
                displayName: displayName
            };
            result(friendPath.setDisplayName, jsonStringify(data), callback);
        },
        /** 
         * 删除好友 
         * @memberof FriendProvider 
         * @param {string}     friendId - 好友 Id 
         * @param {function}   callback - 同意结果 callback 中返回
         */
        remove: function(friendId, callback) {
            var data = {
                friendId: friendId
            };
            result(friendPath.remove, jsonStringify(data), callback);
        }
    };

    var Friend = (function(friendDataProvider) {
        var data = [];
        /** 
          * 好友数据变化监控方法
          * @memberof Friend 
          * @param {string}     friend - 好友 
            @example
            var _instance = RongDataModel.init({appkey:'appkey'});\
            _instance.Friend.watch = function(friend){
                 // 所有好友数据发生变化会触发 watch 
            };
          */
        var watch = function(friend) {};
        /** 
         * 申请加好友
         * @memberof Friend 
         * @param {string}     friendId - 好友 Id
         * @see {@link FriendProvider}
         * @example
            var _instance = RongDataModel.init({appkey:'appkey'});
            var friendId = 'xxx';
            _instance.Friend.invite(friendId, functon(result){
                // 申请加好友结果
            });
         */
        var invite = function(friendId, callback) {
            friendDataProvider.invite(friendId, callback);
        };
        /** 
         * 同意加好友
         * @memberof Friend 
         * @param {string}     friendId - 好友 Id
         * @see {@link FriendProvider}
         * @example
            var _instance = RongDataModel.init({appkey:'appkey'});
            var friendId = 'xxx';
            _instance.Friend.agree(friendId, function(result){
               // 同意加好友结果
            });
         */
        var agree = function(friendId, callback) {
            //TODO 加好友成功后修改本地数据
            friendDataProvider.agree(friendId, callback);
        };
        /** 
         * 忽略加好友请求
         * @memberof Friend 
         * @param {string}     friendId - 好友 Id
         * @see {@link FriendProvider}
         * @example
            var _instance = RongDataModel.init({appkey:'appkey'});
            var friendId = 'xxx';
            _instance.Friend.ignore(friendId, function(result){
                //忽略加好友请求结果
            });
         */
        var ignore = function(friendId, callback) {
            friendDataProvider.ignore(friendId, callback);
        };
        var _success = function(result, cb) {
            for (var i = 0, len = data.length; i < len; i++) {
                if (data[i].user.id == result.user.id) {
                    cb(i);
                    Friend.watch(result);
                    break;
                }
            }
        };
        /** 
         * 删除好友
         * @memberof Friend 
         * @param {string}     friendId - 好友 Id
         * @see {@link FriendProvider}
         * @example
            var _instance = RongDataModel.init({appkey:'appkey'});
            var friendId = 'xxx';
            _instance.Friend.remove(friendId);
         */
        var remove = function(friendId) {
            friendDataProvider.remove(friendId, function(result) {
                _success(result, function(index) {
                    data.splice(i, 1);
                });
            });
        };
        /** 
         * 设置好友备注
         * @memberof Friend 
         * @param {string}     friendId - 好友 Id
         * @param {string}     displayName - 备注名称
         * @see {@link FriendProvider}
         * @example
            var _instance = RongDataModel.init({appkey:'appkey'});
            var friendId = 'xxx', displayName = 'name';
            _instance.Friend.setDisplayName(friendId, displayName);
         */
        var setDisplayName = function(friendId, displayName) {
            friendDataProvider.set_display_name(friendId, displayName, function(result) {
                _success(result, function(index) {
                    data[i] = result;
                });
            });
        };
        /** 
         * 获取好友列表
         * @memberof Friend 
         * @see {@link FriendProvider}
         * @example
            var _instance = RongDataModel.init({appkey:'appkey'});
            var friends = _instance.Friend.get();
            @returns {array}
         */
        var get = function() {
            return data;
        };
        var _push = function(friends) {
            data = friends;
        };
        watcher('Pull_Friend', function() {
            FriendDataProvider.getAll(function(data) {
                _push(data.result);
                userFormat(data.result, function(user) {
                    emit('User', user);
                });
            });
        });

        return {
            invite: invite,
            remove: remove,
            ignore: ignore,
            agree: agree,
            setDisplayName: setDisplayName,
            get: get,
            watch: watch,
            FriendDataProvider: friendDataProvider
        };
    })(FriendDataProvider);
    /** Friend DataModel end region*/

    /** Group DataModel region*/

    /**
     *  @namespace Group
     */

    /**
     * 群组模型数据接口
     * @namespace GroupProvider
     */

    /**
     * 请求数据 url, 如果你用到群组模块，可以以根据下面的 url 进行重写服务。
     * @memberof GroupProvider
     * @enum {string}
     */
    var groupPath = {
        /** 获取全部群组 */
        all: 'user/groups',
        /** 获取群成员 */
        members: 'group/{groupId}/members',
        /** 创建群 */
        create: 'group/create',
        /** 加入群 */
        join: 'group/join',
        /** 退出群 */
        quit: 'group/quit',
        /** 解散群 */
        dismiss: 'group/dismiss',
        /** 转让群主角色 */
        transfer: 'group/transfer',
        /** 发布群公告 */
        notice: 'group/set_bulletin',
        /** 设置群头像 */
        set_portrait_uri: 'group/set_portrait_uri',
        /** 设置自己的群昵称 */
        set_display_name: 'group/set_display_name',
        /** 群组重命名 */
        rename: 'group/rename',
        /** 踢人 */
        kick: 'group/kick',
        /** 加人 */
        add: 'group/add'
    };

    var GroupDataProvider = {
        /** 
         * 获取群组列表  
         * @memberof GroupProvider 
         * @param {function}   callback - 返回群组列表
         */
        get: function(callback) {
            request(groupPath.all, null, callback);
        },
        /** 
         * 创建群  
         * @memberof GroupProvider 
         * @param {string}   name - 群名称
         * @param {array}    memberIds - 群成员 Id 数组
         * @param {function} callback - 返回群组列表
         */
        create: function(name, memberIds, callback) {
            var data = {
                memberIds: memberIds
            };
            request(groupPath.create, jsonStringify(data), callback);
        },
        /** 
         * 创建群  
         * @memberof GroupProvider 
         * @param {string}   groupId - 群 Id 
         * @param {function} callback - 返回加群结果
         */
        join: function(groupId, callback) {
            var data = {
                groupId: groupId
            };
            request(groupPath.join, jsonStringify(data), callback);
        },
        /** 
         * 退出群  
         * @memberof GroupProvider 
         * @param {string}   groupId - 群 Id 
         * @param {function} callback - 返回退群结果
         */
        quit: function(groupId, callback) {
            var data = {
                groupId: groupId
            };
            request(groupPath.quit, jsonStringify(data), callback);
        },
        /** 
         * 解散群  
         * @memberof GroupProvider 
         * @param {string}   groupId - 群 Id 
         * @param {function} callback - 返回解散群结果
         */
        dismiss: function(groupId, callback) {
            var data = {
                groupId: groupId
            };
            request(groupPath.dismiss, jsonStringify(data), callback);
        },
        /** 
         * 转让群主角色  
         * @memberof GroupProvider 
         * @param {string}   groupId - 群 Id 
         * @param {string}   userId - 新群主的 userId
         * @param {function} callback - 返回转让群主结果
         */
        transferManager: function(groupId, userId, callback) {
            var data = {
                groupId: groupId
            };
            request(groupPath.dismiss, jsonStringify(data), callback);
        },
        /** 
         * 发布群公告  
         * @memberof GroupProvider 
         * @param {string}   groupId - 群 Id 
         * @param {string}   notice - 公告内容
         * @param {function} callback - 返回发布公告结果
         */
        setNotice: function(groupId, notice, callback) {
            var data = {
                groupId: groupId,
                bulletin: notice
            };
            request(groupPath.notice, jsonStringify(data), callback);
        },
        /** 
         * 设置群头像  
         * @memberof GroupProvider 
         * @param {string}   groupId - 群 Id 
         * @param {string}   portraiUri - 头像地址
         * @param {function} callback - 返回设置头像结果
         */
        setPortaitUri: function(groupId, portraiUri, callback) {
            var data = {
                groupId: groupId
            };
            request(groupPath.set_portrait_uri, jsonStringify(data), callback);
        },
        /** 
         * 设置群自己的群备注
         * @memberof GroupProvider 
         * @param {string}   groupId - 群 Id 
         * @param {string}   portraiUri - 头像地址
         * @param {function} callback - 返回设置头像结果
         */
        setDisplayName: function(groupId, displayName) {
            var data = {
                groupId: groupId,
                displayName: displayName
            };
            request(groupPath.set_display_name, jsonStringify(data), callback);
        },
        /** 
         * 群组重命名
         * @memberof GroupProvider 
         * @param {string}   groupId - 群 Id 
         * @param {string}   name - 昵称
         * @param {function} callback - 返回重命名结果
         */
        rename: function(groupId, name, callback) {
            var data = {
                groupId: groupId,
                name: name
            };
            request(groupPath.rename, jsonStringify(data), callback);
        },
        /** 
         * 获取群成员
         * @memberof GroupProvider 
         * @param {string}   groupId - 群 Id 
         * @param {function} callback - 返回成员列表
         */
        getMembers: function(groupId, callback) {
            request(groupPath.members.replace(/{groupId}/, groupId), null, function(data) {
                callback(data.result);
            });
        },
        /** 
         * 添加新成员
         * @memberof GroupProvider 
         * @param {string}   groupId - 群 Id 
         * @param {array}   memberIds - 成员 id 数组 
         * @param {function} callback - 返回添加成员结果
         */
        addMember: function(groupId, memberIds, callback) {
            var data = {
                groupId: groupId
            };
            request(groupPath.add, jsonStringify(data), callback);
        },
        /** 
         * 添加新成员
         * @memberof GroupProvider 
         * @param {string}   groupId - 群 Id 
         * @param {array}   memberIds - 成员 id 数组 
         * @param {function} callback - 返回踢人结果
         */
        kickMember: function(groupId, memberIds, callback) {
            var data = {
                groupId: groupId,
                memberIds: memberIds
            };
            request(groupPath.kick, jsonStringify(data), callback);
        }
    };

    var Group = (function(groupDatProvider) {
        var data = [],
            groupMembers = {};
        var createMember = function(user) {
            return {
                displayName: "",
                role: 0,
                createdAt: +new Date,
                updatedAt: +new Date,
                user: user
            };
        };
        /** 
         * 创建群
         * @memberof Group 
         * @param {string}   name - 群名称
         * @param {string}   memberIds - 群成员 Id 数组
         * @see {@link GroupProvider}
         * @example
            var _instance = RongDataModel.init({appkey:'appkey'});
            var groupName = 'rongcloud';
            var memberIds = ['userId1', 'userId2', 'userId3'];
            _instance.Group.create(name, memberIds, function(){
                // 创建群成功
            });
         */
        var create = function(name, memberIds, callback) {
            /**
                var group = {name:'', portraitUri:''}
             */
            groupDatProvider.create(group, memberIds, function(data) {
                var groupId = data.result.id;
                var groupInfo = {
                    role: 1,
                    group: {
                        id: groupId,
                        name: group.name,
                        portraitUri: group.portraitUri,
                        creatorId: currentUserId,
                        memberCount: memberIds.length,
                        maxMemberCount: 500
                    }
                };
                data.push(groupInfo);
                var members = [];
                User.getUsers(memberIds, function(users) {
                    for (var i = 0, len = memberIds.length; i < len; i++) {
                        var memberId = memberIds[i];
                        memberId in users && members.push(createMember(users[memberId]));
                    }
                    groupMembers[groupId].concat(members);
                });
                callback();
            });
        };
        /** 
         * 获取群列表
         * @memberof Group 
         * @see {@link GroupProvider}
         * @example
            var _instance = RongDataModel.init({appkey:'appkey'});
            var groups = _instance.Group.get();
           @returns {array}
         */
        var get = function() {
            return data;
        };
        /** 
         * 加入群
         * @memberof Group 
         * @param {string}   groupId - 群 Id
         * @param {function}   callback - 返回加入群结果
         * @see {@link GroupProvider}
         * @example
            var _instance = RongDataModel.init({appkey:'appkey'});
            var groupId = 'groupId';
            _instance.Group.join(groupId, function(){
                // join Successfully
            });
         */
        var join = function(groupId, callback) {
            groupDatProvider.join(groupId, function() {
                User.get(currentUserId, function(user) {
                    groupMembers[groupId].push(createMember(user));
                });
                callback();
            });
        };

        var memberHandle = function(groupId, userId, callback) {
            var members = groupMembers[groupId];
            for (var i = 0, len = members.length; i < len; i++) {
                if (userId == members[i].user.id) {
                    callback(i);
                    break;
                }
            }
        };
        /** 
         * 退出群
         * @memberof Group 
         * @param {string}   groupId - 群 Id
         * @param {function}   callback - 返回退出群结果
         * @see {@link GroupProvider}
         * @example
            var _instance = RongDataModel.init({appkey:'appkey'});
            var groupId = 'groupId';
            _instance.Group.join(groupId, function(){
                // quit Successfully
            });
         */
        var quit = function(groupId, callback) {
            groupDatProvider.quit(groupId, function() {
                memberHandle(groupId, currentUserId, function(index) {
                    groupMembers[groupId].splice(index, 1);
                });
                callback();
            });
        };
        /** 
         * 添加成员
         * @memberof Group 
         * @param {string}   groupId - 群 Id
         * @param {string}   memberIds - 群成员 Id 数组
         * @param {function}   callback - 返回添加成员结果
         * @see {@link GroupProvider}
         * @example
            var _instance = RongDataModel.init({appkey:'appkey'});
            var groupId = 'groupId';
            var memberIds = ['userId5', 'userId6'];
            _instance.Group.addMember(groupId, memberIds, function(){
                //addMember Successfully
            });
         */
        var addMember = function(groupId, memberIds, callback) {
            groupDatProvider.addMember(groupId, memberIds, function() {
                User.getUsers(memberIds, function(users) {
                    for (var i = 0, len = memberIds.length; i < len; i++) {
                        var memberId = memberIds[i];
                        memberId in users && members.push(createMember(users[memberId]));
                    }
                    groupMembers[groupId].concat(members);
                });
                callback();
            });
        };
        /** 
         * 踢人
         * @memberof Group 
         * @param {string}   groupId - 群 Id
         * @param {string}   memberIds - 群成员 Id 数组
         * @param {function}   callback - 返回踢人结果
         * @see {@link GroupProvider}
         * @example
            var _instance = RongDataModel.init({appkey:'appkey'});
            var groupId = 'groupId';
            var memberIds = ['userId5', 'userId6'];
            _instance.Group.addMember(groupId, memberIds, function(){
                //kickMember Successfully
            });
         */
        var kickMember = function(groupId, memberIds, callback) {
            groupDatProvider.kickMember(groupId, memberIds, function() {
                for (var i = 0, len = memberIds.length; i < len; i++) {
                    memberHandle(groupId, memberIds[i], function(index) {
                        groupMembers[groupId].splice(index, 1);
                    });
                }
                callback();
            });
        };
        /** 
         * 设置自己的群昵称
         * @memberof Group 
         * @param {string}   groupId - 群 Id
         * @param {string}   displayName - 自己的群昵称
         * @param {function}   callback - 返回设置昵称结果
         * @see {@link GroupProvider}
         * @example
            var _instance = RongDataModel.init({appkey:'appkey'});
            var groupId = 'groupId';
            var displayName = 'name';
            _instance.Group.setDisplayName(groupId, displayName, function(){
                //setDisplayName Successfully
            });
         */
        var setDisplayName = function(groupId, displayName, callback) {
            groupDatProvider.setDisplayName(groupId, displayName, function() {
                memberHandle(groupId, currentUserId, function(index) {
                    groupMembers[groupId][index].displayName = displayName;
                });
            });
        };
        /** 
         * 转让群主角色
         * @memberof Group 
         * @param {string}   groupId - 群 Id
         * @param {string}   userId - 新群主的 Id 
         * @param {function}   callback - 返回转让群主结果
         * @see {@link GroupProvider}
         * @example
            var _instance = RongDataModel.init({appkey:'appkey'});
            var groupId = 'groupId';
            var userId = 'userId';
            _instance.Group.setDisplayName(groupId, userId, function(){
                //transfer Successfully
            });
         */
        var transferManager = function(groupId, userId, callback) {
            groupDatProvider.transferManager(groupId, userId, function() {
                // 取消自己是管理员身份
                memberHandle(groupId, currentUserId, function(index) {
                    groupMembers[groupId][index].role = 1;
                });
                // 绑定指定用户为管理员
                memberHandle(groupId, userId, function(index) {
                    groupMembers[groupId][index].role = 0;
                });
                callback();
            });
        };
        /** 
         * 获取成员
         * @memberof Group 
         * @param {string}   groupId - 群 Id
         * @param {function}   callback - 返回群成员列表
         * @see {@link GroupProvider}
         * @example
            var _instance = RongDataModel.init({appkey:'appkey'});
            var groupId = 'groupId';
            _instance.Group.getMembers(groupId, function(members){
                //members:群成员列表
            });
         */
        var getMembers = function(groupId, callback) {
            if (groupId in groupMembers) {
                callback(groupMembers[groupId]);
            } else {
                var cacheMembers = function(members) {
                    userFormat(members, function(user) {
                        emit('User', user); // fire User, cache userInfo.
                    });
                    groupMembers[groupId] = members;
                    callback(members);
                };
                groupDatProvider.getMembers(groupId, cacheMembers);
            }
        };

        var groupHandle = function(grupId, callback) {
            for (var i = 0, len = data.length; i < len; i++) {
                if (groupId == data[i].group.id) {
                    callback(i);
                    break;
                }
            }
        };
        /** 
         * 解散群组
         * @memberof Group 
         * @param {string}   groupId - 群 Id
         * @param {function} callback - 返回解散群结果
         * @see {@link GroupProvider}
         * @example
            var _instance = RongDataModel.init({appkey:'appkey'});
            var groupId = 'groupId';
            _instance.Group.dismiss(groupId, function(){
                //dismiss Group Successfully
            });
         */
        var dismiss = function(groupId, callback) {
            groupDatProvider.dismiss(groupId, function() {
                groupHandle(groupId, function(index) {
                    data.splice(i, 1);
                    delete groupMembers[groupId];
                });
                callback();
            });
        };
        /** 
         * 设置群头像
         * @memberof Group 
         * @param {string}   groupId - 群 Id
         * @param {string}   portraitUri - 头像地址
         * @param {function}   callback - 返回设置头像结果
         * @see {@link GroupProvider}
         * @example
            var _instance = RongDataModel.init({appkey:'appkey'});
            var groupId = 'groupId';
            var portraitUri = 'http://xxx.xxx.com/portraitUri.png';
            _instance.Group.setPortaitUri(groupId, portraitUri, function(){
                //setPortaitUri Successfully
            });
         */
        var setPortaitUri = function(groupId, portraitUri, callback) {
            groupDatProvider.setPortaitUri(groupId, bulletin, function() {
                groupHandle(groupId, function(index) {
                    data[index].group.portraitUri = portraitUri;
                });
                callback();
            });
        };
        /** 
         * 群名称重命名
         * @memberof Group 
         * @param {string}   groupId - 群 Id
         * @param {string}   name - 群新名称
         * @param {function}   callback - 返回群重命名结果
         * @see {@link GroupProvider}
         * @example
            var _instance = RongDataModel.init({appkey:'appkey'});
            var groupId = 'groupId';
            var name = 'rename';
            _instance.Group.rename(groupId, name, function(){
                //rename Successfully
            });
         */
        var rename = function(groupId, name, callback) {
            groupDatProvider.rename(groupId, displayName, function() {
                groupHandle(groupId, function(index) {
                    data[index].group.name = name;
                });
                callback();
            });
        };
        /** 
         * 发布群公告
         * @memberof Group 
         * @param {string}   groupId - 群 Id
         * @param {string}   notice - 公告内容
         * @param {function}   callback - 返回发布公告结果
         * @see {@link GroupProvider}
         * @example
            var _instance = RongDataModel.init({appkey:'appkey'});
            var groupId = 'groupId';
            var notice = '公告内容';
            _instance.Group.setNotice(groupId, notice, function(){
                //setNotice Successfully
            });
         */
        var setNotice = function(groupId, notice, callback) {
            groupDatProvider.setNotice(groupId, notice, function() {
                callback();
            });
        };
        var _pushGrups = function(groups) {
            data = groups;
        };
        watcher('Pull_Group', function() {
            GroupDataProvider.get(function(data) {
                _pushGrups(data.result);
            });
        });
        return {
            create: create,
            join: join,
            quit: quit,
            get: get,
            dismiss: dismiss,
            transferManager: transferManager,
            setNotice: setNotice,
            setPortaitUri: setPortaitUri,
            setDisplayName: setDisplayName,
            rename: rename,
            getMembers: getMembers,
            addMember: addMember,
            kickMember: kickMember
        };
    })(GroupDataProvider);

    /** Group DataModel end region */

    /** Conversation DataModel region */

    /**
     *  @namespace Conversation
     */

    /**
     * 会话模型数据接口
     * @namespace ConversationProvider
     */
    var ConversationDataProvider = {
        /** 
         * 获取会话列表  
         * @memberof ConversationProvider 
         * @param {function}   callback - 返回会话列表
         */
        getConversationList: function(callback) {
            RongIMLib.RongIMClient.getInstance().getConversationList({
                onSuccess: function(result) {
                    callback(result);
                },
                onError: function(error) {}
            }, [1, 3]);
        },
        sortConversationList: function(conversationList, callback) {
            var convers = [];
            for (var i = 0, len = conversationList.length; i < len; i++) {
                if (!conversationList[i]) {
                    continue;
                }
                if (conversationList[i].isTop) {
                    convers.push(conversationList[i]);
                    conversationList.splice(i, 1);
                    continue;
                }
                for (var j = 0; j < len - i - 1; j++) {
                    if (conversationList[j].sentTime < conversationList[j + 1].sentTime) {
                        var swap = conversationList[j];
                        conversationList[j] = conversationList[j + 1];
                        conversationList[j + 1] = swap;
                    }
                }
            }
            return convers.concat(conversationList);
        },
        /** 
         * 清除未读消息数  
         * @memberof ConversationProvider 
         * @param {number} conversationType - 会话类型
         * @param {string} targetId - 目标 Id 
         */
        clearUnReadCount: function(conversationType, targetId) {
            RongIMLib.RongIMClient.getInstance().clearUnreadCount(conversationType, targetId, {
                onSuccess: function(count) {},
                onError: function() {}
            });
        },
        /** 
         * 删除会话  
         * @memberof ConversationProvider 
         * @param {number} conversationType - 会话类型
         * @param {string} targetId - 目标 Id 
         */
        remove: function(conversationType, targetId) {
            RongIMClient.getInstance().removeConversation(conversationType, targetId, {
                onSuccess: function(bool) {},
                onError: function(error) {}
            });
        }
    };

    var bindUser = function(data, callback) {
        var process = function(user) {
            data.user = user;
            callback && callback(data);
        };
        if (data.conversationType == RongIMLib.ConversationType.PRIVATE) {
            User.get(data.senderUserId || data.targetId, process);
        } else if (data.conversationType == RongIMLib.ConversationType.GROUP) {
            if (data.latestMessage) {
                Group.get(process, data.targetId);
            } else {
                User.get(data.senderUserId, process);
            }
        } else {
            // TODO 扩展
            process({});
        }
    };

    var composeUserInfo = function(data, callback) {
        if (getPrototype.call(data) == '[object Array]') {
            for (var i = 0, len = data.length; i < len; i++) {
                bindUser(data[i]);
            }
            callback(data);
        } else {
            bindUser(data, callback);
        }
    };

    var Conversation = (function(conDataProvider) {
        var data = [];
        var watch = function(conversation) {

        };
        /** 
         * 获取列表
         * @memberof Conversation 
         * @see {@link Conversation}
         * @example
            var _instance = RongDataModel.init({appkey:'appkey'});
            _instance.Conversation.get(function(list){
                // list 会话列表
            });
         */
        var get = function(callback) {
            conDataProvider.getConversationList(function(conversations) {
                composeUserInfo(conversations, function(items) {
                    var _list = conDataProvider.sortConversationList(conversations);
                    data = _list;
                    callback(_list);
                });
            });
        };
        /** 
         * 置顶会话
         * @memberof Conversation 
         * @param {string}   conversation - 会话对象
         * @see {@link Conversation}
         * @example
            var _instance = RongDataModel.init({appkey:'appkey'});
            var conversation = {conversationType:'', targetId:''}; // 请获取完整的会话对象
            _instance.Conversation.setConversationTop(conversation, function(){
                // 置顶成功
            });
         */
        var setConversationTop = function(conversation, callback) {
            data.unshift(conversation);
            callback();
        };
        /** 
         * 修改会话
         * @memberof Conversation 
         * @param {string}   conversation - 会话对象
         * @see {@link Conversation}
         * @example
            var _instance = RongDataModel.init({appkey:'appkey'});
            var conversation = {conversationType:'', targetId:''}; // 请获取完整的会话对象
            _instance.Conversation.set(conversation, function(){
                // 修改会话成功
            });
         */
        var set = function(conversation) {
            var isInsert = true;
            for (var i = 0, len = data.length; i < len; i++) {
                if (data[i].conversationType == conversation.conversationType && data[i].targetId == conversation.targetId) {
                    setConversationTop(data.splice(i, 1)[0]);
                    isInsert = false;
                    break;
                }
            }
            //TODO  setTop
            if (isInsert) {
                composeUserInfo(conversation, function(result) {
                    setConversationTop(result);
                });
            }
            Conversation.watch(conversation);
        };
        /** 
         * 清除未读消息数
         * @memberof Conversation 
         * @param {string}   conversation - 会话对象
         * @see {@link Conversation}
         * @example
            var _instance = RongDataModel.init({appkey:'appkey'});
            var conversation = {conversationType:'', targetId:''}; // 请获取完整的会话对象
            _instance.Conversation.clearUnReadCount(conversationType, targetId);
         */
        var clearUnReadCount = function(conversationType, targetId) {
            //TODO 发送多端同步消息
            conDataProvider.clearUnReadCount(conversationType, targetId);
            var clearUnread = function(conversation) {
                conversation.unreadMessageCount = 0;
            };
            for (var i = 0, len = data.length; i < len; i++) {
                if (data[i].conversationType == conversationType && data[i].targetId == targetId) {
                    clearUnread(data[i]);
                    break;
                }
            }
        };
        var removeConversation = function(index, conversationType, targetId) {
            data.splice(index, 1);
            clearUnReadCount(conversationType, targetId);
        };
        /** 
         * 隐藏
         * @memberof Conversation 
         * @param {number}   conversationType - 会话类型
         * @param {string}   targetId - 目标 Id
         * @see {@link Conversation}
         * @example
            var _instance = RongDataModel.init({appkey:'appkey'});
            var conversationType = 1;
            var targetId = ''; 
            _instance.Conversation.hidden(conversationType, targetId);
         */
        var hidden = function(conversationType, targetId) {
            for (var i = 0, len = data.length; i < len; i++) {
                if (data[i].conversationType == conversationType && data[i].targetId == targetId) {
                    removeConversation(i, conversationType, targetId);
                    break;
                }
            }
        };
        /** 
         * 删除会话
         * @memberof Conversation 
         * @param {number}   conversationType - 会话类型
         * @param {string}   targetId - 目标 Id
         * @see {@link Conversation}
         * @example
            var _instance = RongDataModel.init({appkey:'appkey'});
            var conversationType = 1;
            var targetId = ''; 
            _instance.Conversation.remove(conversationType, targetId);
         */
        var remove = function(conversationType, targetId) {
            conDataProvider.remove(conversationType, targetId);
            hidden(conversationType, targetId);
        };

        watcher('Conversation', function(data) {
            data = data || RongIMClient._memoryStore.conversationList.slice(0, 1)[0];
            set(data);
        });

        return {
            hidden: hidden,
            remove: remove,
            set: set,
            get: get,
            clearUnReadCount: clearUnReadCount,
            watch: watch
        };
    })(ConversationDataProvider);

    /** Conversation DataModel end region */

    /** Message DataModel region */

    /**
     *  @namespace Message
     */

    /**
     * 会话模型数据接口
     * @namespace MessageProvider
     */

    var getMessageId = function() {
        return RongIMLib.MessageIdHandler.messageId + 1;
    };
    var genLocalMsg = function(params) {
        var msg = new RongIMLib.Message();
        msg.content = params.content;
        msg.conversationType = params.conversationType;
        msg.targetId = params.targetId;
        msg.senderUserId = currentUserId;
        msg.sentStatus = RongIMLib.SentStatus.SENDING;
        msg.messageId = getMessageId();
        msg.messageType = params.content.messageName;
        return msg;
    };
    var MessageDataProvider = {
        /**
            获取历史消息
            @param {object} params - 获取历史消息参数对象
            @param {number} params.conversationType - 会话类型
            @param {number} params.targetId - 目标 id
            @param {number} params.timestamp - 获取历史消息开始时间
            @param {number} params.count - 每次获取条数
            @param {object} callback - 返回历史消息
            @memberof MessageProvider
         */
        getHistoryMessages: function(params, callback) {
            RongIMLib.RongIMClient.getInstance().getHistoryMessages(params.conversationType, params.targetId, params.timestamp, option.get_historyMsg_count, {
                onSuccess: function(list, hasMore) {
                    callback(list, hasMore);
                },
                onError: function(error) {}
            });
        },
        /**
            发送消息
            @param {object} params - 获取历史消息参数对象
            @param {number} params.conversationType - 会话类型
            @param {number} params.targetId - 目标 id
            @param {number} params.content - 消息内容
            @param {boolean} params.mentiondMsg - @ 消息标识
            @param {string} params.pushText - push 内容
            @param {string} params.appData - 对 pushText 内容的扩展
            @param {object} callback - 返回发送消息结果
            @memberof MessageProvider
         */
        sendMessage: function(params, callback) {
            callback(genLocalMsg(params));
            RongIMLib.RongIMClient.getInstance().sendMessage(params.conversationType, params.targetId, params.content, {
                onSuccess: function(message) {
                    callback(message);
                },
                onError: function(errorCode, message) {
                    callback(message);
                }
            }, params.mentiondMsg, params.pushText, params.appkey, params.methodType);
        }
    };
    var Message = (function(messageDataProvider) {
        var data = {};
        /**
         * 消息变化监听
         * @memberof Message
           @example
            var _instance = RongDataModel.init({appkey:'appkey'});
            _instance.Message.watch = function(message){
            };
         */
        var watch = function(message) {};
        var genDataUId = function(conversationType, targetId) {
            return 'cm_' + conversationType + targetId;
        };
        var set = function(message) {};
        /**
         * 获取历史消息
         * @param {object} params - 获取历史消息参数对象
         * @param {number} params.conversationType - 会话类型
         * @param {number} params.targetId - 目标 id
         * @param {number} params.timestamp - 获取历史消息开始时间
         * @param {object} callback - 返回历史消息
         * @see {@link MessageProvider}
         * @memberof Message
         * @example
             var _instance = RongDataModel.init({appkey:'appkey'});
             var params = {
                conversationType:1,
                targetId:'',
                timestamp:0
             };
             _instance.Message.get(params, function(result, hasMore){
                // result: 历史消息数组
                // hasMore : 是否有更多的历史消息
             });
         */
        var get = function(params, callback) {
            var key = genDataUId(params.conversationType, params.targetId);
            var memoryMsgs = data[key];
            if (params.position == 2 || !memoryMsgs) {
                params.timestamp = params.timestamp || 0;
                messageDataProvider.getHistoryMessages(params, function(list, hasMore) {
                    composeUserInfo(list, function(result) {
                        if (!memoryMsgs) {
                            data[key] = result;
                        } else if (memoryMsgs.length < option.max_msg_count) {
                            data[key].concat(result);
                        }
                        callback(result, hasMore);
                    });
                });
            } else {
                callback(memoryMsgs, true);
            }
        };
        var _push = function(message) {
            var key = genDataUId(message.conversationType, message.targetId);
            var isInsert = true;
            composeUserInfo(message, function() {
                data[key] = data[key] || [];
                for (var i = 0, len = data[key].length; i < len; i++) {
                    if (data[key][i].messageId == message.messageId) {
                        data[key][i].sentStatus = message.sentStatus;
                        isInsert = false;
                        break;
                    }
                }
                isInsert && data[key].push(message);
                emit('Conversation');
                Message.watch(message);
            });

        };
        /**
         * 发送消息
         * @param {object} params - 获取历史消息参数对象
         * @param {number} params.conversationType - 会话类型
         * @param {number} params.targetId - 目标 id
         * @param {number} params.content - 消息内容
         * @param {boolean} params.mentiondMsg - @ 消息标识
         * @param {string} params.pushText - push 内容
         * @param {string} params.appData - 对 pushText 内容的扩展
         * @param {object} callback - 返回发送消息结果
         * @memberof Message
         * @see {@link MessageProvider}
         * @example
             var _instance = RongDataModel.init({appkey:'appkey'});
             var params = { 
                conversationType:1,
                targetId:'',
                content:_instance.Message.TextMessage.obtain('hello world')
             };
             _instance.Message.send(params);
         */
        var send = function(params) {
            messageDataProvider.sendMessage(params, function(message) {
                _push(message);
            });
        };
        watcher('Message', function(message) {
            Message._push(message);
        });
        var userModel = {
            set: set,
            get: get,
            send: send,
            watch: watch,
            TextMessage: RongIMLib.TextMessage,
            MessageDataProvider: messageDataProvider
        };
        // 动态暴露 RongIMLib Message 相关属性。
        var bindings = ['TextMessage', 'FileMessage', 'ImageMessage'];
        loop(bindings, function(proto) {
            userModel[proto] = RongIMLib[proto];
        });
        return userModel;
    })(MessageDataProvider);
    /** Message DataModel end region */

    /** Status DataModel region */

    /**
     * @namespace Status
     */
    var Status = (function() {
        var data = -2;
        /**
         * 状态监听
         * @memberof Status
         * @example
           var _instance = RongDataModel.init({appkey:'appkey'});
           var connStatus = _instance.Status.ConnectionStatus;
           _instance.Status.watch = function(status){
                if(status == connStatus.CONNECTING){
                    // 连接中
                }elseif (status == connStatus.CONNECTED) {
                    // 连接成功
                } 
           };
         */
        var watch = function(status) {};
        /**
         * 获取当前连接状态
         * @memberof Status
         * @example
           var _instance = RongDataModel.init({appkey:'appkey'});
           var status = _instance.Status.get();
           console.log(status);
         * @returns {number}
         */
        var get = function() {
            return data;
        };
        /**
         * 连接服务器
         * @memberof Status
         * @param {string} token - 用户在融云的唯一身份标识
         * @example
           var _instance = RongDataModel.init({appkey:'appkey'});
           var token = 'DsdfkDISk==';
           _instance.Status.connect(token);
         */
        var connect = function(token) {
            RongIMClient.connect(token, {
                onSuccess: function(userId) {
                    currentUserId = RongIMClient.getInstance().getCurrentUserId();
                },
                onTokenIncorrect: function() {
                    Status.watch(RongIMLib.ConnectionState.TOKEN_INCORRECT);
                },
                onError: function(errorCode) {
                    Status.watch(errorCode);
                }
            });
        };
        /**
         * 断开与服务器连接
         * @memberof Status
         * @example
           var _instance = RongDataModel.init({appkey:'appkey'});
           _instance.Status.disconnect();
         */
        var disconnect = function() {
            RongIMClient.getInstance().disconnect();
        };
        var _push = function(status) {
            data = status;
            Status.watch(status);
        };
        watcher('Status', function(status) {
            _push(status);
        });
        var statusModel = {
            get: get,
            connect: connect,
            disconnect: disconnect,
            watch: watch
        };
        // 动态暴露 RongIMLib 状态相关属性。
        var bindings = ['ConnectionStatus'];
        loop(bindings, function(proto) {
            statusModel[proto] = RongIMLib[proto];
        });
        return statusModel;
    })();
    /** Status DataModel end region */

    var pullModelData = function(kinds) {
        for (var i = 0, len = kinds.length; i < len; i++) {
            var key = 'Pull_' + kinds[i];
            emit(key);
        }
    };
    /**
     * 初始化
     * @memberof RongDataModel
     * @static
     * @example
        var config = {
            appkey:'',                              // 必传
            dataAccessProvider:null,                // 可选
            dm:{                                    // 可选
                max_msg_count:20,                   // 本地缓存消息条数上限
                max_conversation_count:50,          // 本地缓存会话个数上限
                get_historyMsg_count:5,             // 每次拉取历史消息个数
                server_path:'http://api.cn/',       // Server 地址,请以 '/' 结尾
                data:['User', 'Group', 'Friend']    // 可选 默认获取用户、群组、好友信息
            },                      
            sdk:{navi:''}                           // 可选
        };
        var _instance = RongDataModel.init(config);
     */
    var init = function(config) {
        if (config && config.dm) {
            var imOpts = config.dm;
            forEach(imOpts, function(key, value) {
                option[key] = value;
            });
        }
        
        pullModelData(option.data);

        RongIMClient.init(config.appkey, config.dataAccessProvider, config.sdk);
        RongIMClient.setConnectionStatusListener({
            onChanged: function(status) {
                emit('Status', status);
            }
        });
        RongIMClient.setOnReceiveMessageListener({
            onReceived: function(message) {
                emit('Message', message);
            }
        });

        return {
            User: User,
            Group: Group,
            Friend: Friend,
            Conversation: Conversation,
            Message: Message,
            Status: Status,
            option: option
        };
    };

    win.RongDataModel = {
        init: init
    };
})(window, RongIMLib, RongIMClient);