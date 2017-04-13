<template>
    <div class="demo">
        <vue-music style="width: 300px;height: 600px;margin: 100px auto;"></vue-music>
    </div>
</template>
<script>
    import vueMusic from '../component/index.vue';
    module.exports = {
        components: {vueMusic},
        data () {
            return {
                page: 'about'
            }
        }
    }
</script>