Vue.component('tab-home', {
    data: function(){
        return{
            rooms: []
        }
    },

    created: function(){
        this.getRooms();
    },
    methods:{
        getRooms(){
            var answer = [];
            $.ajax({
                async:false,
                url: 'http://smart-house/api/rooms',
                type: 'GET',
                beforeSend: function(req) {
                    req.setRequestHeader('Authorization', 'Bearer ML0catqFdq1ocD6GsQSwuowi7a4zyKXW');
                    },
                success: function (response) {
                    answer = response;
                },
                error: function (xhr) {
                    console.log(xhr);
                }
            });

            this.rooms = answer;
        },
    },
    template:`<div>
        <h3 class="label">Избранные устройства и датчики комнаты</h3>
        <div class="list">
            <div>
                <img src="" alt="нет изображения">
                <p>Светильник</p>
            </div>
        </div>

        <h3 class="label">Доступные комнаты</h3>
        <div class="list">
            <div v-for="room in rooms" :key="room.id" @click="content.currentRoom=room.id">
                <img src=""  alt="нет изображения">
                <p>{{room.name}}</p>
            </div>
        </div>
    </div>`
});

Vue.component('tab-devices', {

    data: function(){
        return{
            room: {},
            devices: []
        }
    },
    created: function(){
        this.getRoom();
        this.getDevices();
    },
    methods:{
        getRoom(){
            let answer = {};
            $.ajax({
                async:false,
                url: 'http://smart-house/api/rooms/' + content.currentRoom,
                type: 'GET',
                headers:{
                    'Authorization':'Bearer ML0catqFdq1ocD6GsQSwuowi7a4zyKXW'
                },
                success: function (response) {
                    answer = response;
                },
                error: function (xhr) {
                    console.log(xhr);
                }
            });

            this.room = answer;
        },

        getDevices: function(){

                var answerDev = [];
                $.ajax({
                    async: true,
                    crossDomain:true,
                    url: 'http://smart-house/api/macros/browns',
                    method: 'GET',
                    headers:{
                        'Authorization':'Bearer ML0catqFdq1ocD6GsQSwuowi7a4zyKXW',
                    },
                    // success: function (response) {
                    //     answerDev = response;
                    //     console.log(response);
                    // },
                    error: function (xhr) {
                        console.log(xhr);
                    }
                }).done(function (response) {
                    console.log(response);

                });
                console.log('update');

                this.devices = answerDev;
        }
    },
    template: `<div>
     <h3 class="label">Экран комнаты</h3>
        <div class="list">
            <div :key="room.id">
                <img src="" alt="нет изображения">
                <p>{{ room.name}}</p>
            </div>
        </div>
     <h3 class="label">Устройства и датчики комнаты</h3>

     <div class="list">
        <div v-for="device in devices" :key="device.id">
             <img src="" alt="нет изображения">
             <div class="info">
                 <p>{{ device.name }}</p><br>
                 <p>Тип - {{ device.type_name }}</p><br>
                 <p class="green">Статус - {{ device.value }} </p>
             </div>
             <div class="btnpanel">
                 <a href="#" class="submit btn">Изменить</a>
             </div>
        </div>
     </div>`
});

Vue.component('tab-macros', {
    data: function(){
        return{
            macros: [],
            addStatus: false
        }
    },
    created: function(){
        this.getMacros();
    },
    methods:{
        getMacros(){
            var answer = [];
            $.ajax({
                async:false,
                url: 'http://smart-house/api/macros',
                type: 'GET',
                beforeSend: function(req) {
                    req.setRequestHeader('Authorization', 'Bearer ML0catqFdq1ocD6GsQSwuowi7a4zyKXW');
                },
                success: function (response) {
                    answer = response;
                },
                error: function (xhr) {
                    console.log(xhr);
                }
            });

            this.macros = answer;
        },

        removeItem: function(index){
            $.ajax({
                async:false,
                url: 'http://smart-house/api/macros/'+ this.macros[index].id,
                type: 'DELETE',
                beforeSend: function(req) {
                    req.setRequestHeader('Authorization', 'Bearer ML0catqFdq1ocD6GsQSwuowi7a4zyKXW');
                },
                success: function (response) {
                   console.log(response);
                },
                error: function (xhr) {
                    console.log(xhr);
                }
            });
            this.macros.splice(index, 1);
        },

        activeItem: function(index){
            $.ajax({
                async:false,
                url: 'http://smart-house/api/macros/'+ this.macros[index].id,
                type: 'GET',
                beforeSend: function(req) {
                    req.setRequestHeader('Authorization', 'Bearer ML0catqFdq1ocD6GsQSwuowi7a4zyKXW');
                },
                success: function (response) {
                    console.log(response);
                },
                error: function (xhr) {
                    console.log(xhr);
                }
            });
        },

        addItem: function(name){
            this.macros.push({
                id:'',
                name: name
            });
            this.addStatus = !this.addStatus;
            console.log('имя - '+ name);
        }

    },
    template: `<div>
     <h3 class="label">Макросы </h3>
        <a href="#" class="submit btn macrosAddButton" @click.prevent="addStatus = !addStatus">+ новый</a>
                        <div class="list">
                        <tab-macro-new v-if="addStatus" v-on:add="addItem"></tab-macro-new>
                        
                        <tab-macro v-for="(macro, index) in macros"
                        v-bind:key="macro.id"
                        v-bind:name="macro.name"
                        v-on:remove="removeItem(index)"
                        v-on:active="activeItem(index)"
                        ></tab-macro>
</div>
</div>`
});

Vue.component('tab-macro-new', {

    props: [ 'key', 'name'],
    data: function(){
        return {
            macro:''
        }
    },
    template: `<div class="addMacros" >
                            <table>
                                <thead>
                                    <tr>
                                        <td>Название</td>
                                        <td>Устройство</td>
                                        <td>Значение</td>
                                        <td></td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><input v-model="macro" type="text"></td>
                                        <td><input type="text" ></td>
                                        <td><input type="text"></td>
                                        <td><a href="#" v-on:click.prevent="$emit('add', macro)" class="btn submit">Добавить</a></td>
                                    </tr>    
                                </tbody>
                            </table>
                       
                    
                    </div>`
});


Vue.component('tab-macro', {
    props: [ 'key', 'name'],
    template: `<div :key="key">
                   <img src="" alt="нет изображения">
                   <div class="info">
                       <p>{{ name }}</p>
                   </div>
                   <div class="btnpanel">
                       <a href="#" v-on:click.prevent="$emit('active')" class="submit btn">Вкл</a>
                       <a href="#" v-on:click.prevent="$emit('remove')" class="danger btn" >Удалить</a>
                   </div>
               </div>`
});

Vue.component('tab-login', {
    data: function(){
        return{
            errors: function () {
                return content.errors
            }
        }
        },

    methods:{
        //авторизация
        login() {
            var answer = [];
            $.ajax({
                url: 'http://smart-house/api/login',
                type: 'POST',
                async: false,
                data: {
                    login: $('#log').val(),
                    password: $('#password').val()
                },
                success: function (response) {
                    answer = response;
                },
                error: function (xhr) {
                    console.log(xhr);
                }
            });

            if(answer['token']){
                content.token = answer['token'];
                content.auth  = true;
            }else{
                this.errors =  answer['errors'];
            }
        }
        },
    template: `
            <div class="login">
            <div class="error">
                            <h4 v-for="error in errors">
                                <template  v-for="item in error">
                                    {{ item }}
                                </template>
                            </h4>
                        </div>
                        <label>Логин:</label>
                        <input type="text" id="log">
                        <label>Пароль:</label>
                        <input type="password" id="password">
                        <a href="#" v-on:click.prevent="login" class="submit btn">Войти</a>
            </div>`
});

Vue.component('tab-device', {
    data: function(){
        return{
            device: {},
            statusEdit: false,
        }
    },
    created: function(){
        this.getDevice();
    },
    methods:{
        getDevice(){
            let answer = {};
            $.ajax({
                async:false,
                url: 'http://smart-house/api/devices/331',
                type: 'GET',
                headers:{
                    'Authorization':'Bearer ML0catqFdq1ocD6GsQSwuowi7a4zyKXW'
                },
                success: function (response) {
                    answer = response;
                },
                error: function (xhr) {
                    console.log(xhr);
                }
            });

            this.device = answer;
        },
        save(){
            this.statusEdit = false;
            $.ajax({
                async:false,
                url: 'http://smart-house/api/devices/331',
                type: 'PATCH',
                data:{
                    'value': this.device.value
                },
                headers:{
                    'Authorization':'Bearer ML0catqFdq1ocD6GsQSwuowi7a4zyKXW'
                },
                success: function (response) {
                    console.log(response);
                    console.log('Успешно');
                },
                error: function (xhr) {
                    console.log(xhr);
                }
            });
        }
        },


    template: `<div>
    <h3 class="label">Устройство</h3>
            <div class="list">
                <div>
                    <img src="" alt="нет изображения">
                    <div class="info">
                        <p>{{ device.name }}</p><br>
                        <p>Тип - {{ device.type_name }}</p><br>
                        <template v-if="statusEdit == true">
                             <template v-if="device.type_id == 1 || device.type_id == 4">
                                     <label class="green" for="">Статус - </label>
                                    <a href="#" v-bind:class="device.value == 'open'?'active' : '' " class="btnValue" @click.prevent="device.value = 'open'">Open</a><a href="#" 
                            class="btnValue" v-bind:class="device.value == 'close'?'active' : '' " @click.prevent="device.value = 'close'" >Close</a>
                                </template>
                                <template v-if="device.type_id == 2 || device.type_id == 3">
                                     <label class="green" for="">Статус - </label>
                                    <a href="#" v-bind:class="device.value == 'off'?'active' : '' " class="btnValue" @click.prevent="device.value = 'off'">Off</a><a href="#" 
                            class="btnValue" v-bind:class="device.value == 'on'?'active' : '' " @click.prevent="device.value = 'on'" >On</a>
                                </template>
                                <template v-if="device.type_id == 5 || device.type_id == 6">
                                    <label class="green" for="">Статус - </label>
                                    <input class="edit" type="number" v-model="device.value">
                                </template>
                              
                        </template>
                        <template v-else>
                             <p class="green">Статус - {{ device.value }} </p>
                        </template>
                    </div>
                    <div class="btnpanel">
                    
                        <template v-if="!statusEdit">
                            <a href="#" class="submit btn" @click.prevent="statusEdit = !statusEdit">Изменить</a>
                        </template>
                        
                        <template v-else>
                            <a href="#" class="submit btn" @click.prevent="save">Сохранить</a>
                        </template>
                        
                    </div>
                </div>
        </div>`,
});

var content = new Vue({
    el: '.allContent',
    data: {
        seen: false,
        token: '',
        auth: false,
        errors: [],
        currentTab: 'macros',
        currentRoom: '',
        currentDevice: '',
        tabs: {
            auth: [ { name: 'Home', display: 'Домашний экран' },
                { name: 'Devices', display: 'Устройства и датчики' },
                { name: 'Macros', display: 'Макросы' }],
            noauth: [ { name: 'Login', display: 'Авторизация' },]
        }
        },

    //вычисляемые значения
    computed:{
        currentTabComponent: function () {
            return 'tab-' + this.currentTab.toLowerCase();
        }
    },

    created() {

    },

    methods: {
        //при выборе вкладки
        setAlert(e) {
            this.pageNow = e.target.id;
            if (window.innerWidth <= 912) {
                this.seen = false;
            }
            },
    },

    //слежение за изменениями переменных
    watch:{
        //при авторизации
        auth: function (val) {
            if(val == true){
                this.currentTab = 'Home';
            }
        },
        //выбор комнаты
        currentRoom: function (val) {
            this.currentTab = 'Devices';
        }
    },

    //до создания
    beforeCreate(){

        //виден ли нав бар
        window.onload = (event) =>{
            if (window.innerWidth > 912) {
                this.seen = true;
            } else {
                this.seen = false;
            }
        };
    },

    mounted() {
        //отслеживание размеров экрана
        window.onresize = (event) => {
            if (window.innerWidth > 912) {
                this.seen = true;
            } else {
                this.seen = false;
            }
        };
    }

});


