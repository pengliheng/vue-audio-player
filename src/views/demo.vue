<template>
    <div class="demo">
        <vue-music ></vue-music>
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