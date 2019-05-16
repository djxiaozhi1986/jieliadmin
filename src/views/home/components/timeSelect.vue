<template>
    <div class="wi-time-select">
        <RadioGroup v-model="date" type="button" @on-change="dateChange">
            <Radio label="本周" v-if="showWeek"></Radio>
            <Radio label="本月" v-if="showMonth"></Radio>
            <Radio label="本年" v-if="showYear"></Radio>
        </RadioGroup>
    </div>
</template>

<script>
    export default {
        props: {
            bindModel: {
                type: String,
                default: null
            },
            showWeek: {
                type: Boolean,
                default: true
            },
            showMonth: {
                type: Boolean,
                default: true
            },
            showYear: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                date: "本周",
                flag:1
            };
        },
        watch: {
            bindModel(val) {
                this.date = val;
            },
            date(val) {
                var range = this.getDateRange(val);
                var time={
                    flag:this.flag,
                    range :range
                }
                this.$emit("input", time);
            }
        },
        methods: {
            getDateRange(val) {
                let end = new Date();
                let start = new Date();
                switch (val) {
                    case "本周":
                        start = new Date(
                            new Date(start.getFullYear(), start.getMonth(), start.getDate() - start.getDay()+1)
                        );
                        this.flag = 1;
                        // start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        break;
                    case "本月":
                        start.setTime(new Date(start.getFullYear(), start.getMonth(), 1))
                        this.flag = 2;
                        break;
                    case "本年":
                        start.setTime(new Date(start.getFullYear(), 1, 1))
                        this.flag = 4;
                        break;
                    default:
                        if (val) {
                            start = val[0];
                            end = new Date(
                                val[1].setTime(
                                    val[1].getTime() 
                                )
                            );
                        }
    
                        break;
                }
                let range = {
                    start: start.Format("yyyy/MM/dd 00:00"),
                    end: end.Format("yyyy/MM/dd hh:mm")
                };
                return range;
            },
            dateChange(val) {
                var range = this.getDateRange(val);
                var time={
                    flag:this.flag,
                    range :range
                }
                this.$emit("change", time);
            }
        },
        created() {
            if (this.showWeek) {
                this.date = "本周";
                this.flag = 1;
            } else {
                if (this.showMonth) {
                    this.date = "本月";
                this.flag = 2;
                } else {
                    if (this.showYear) {
                        this.date = "本年";
                        this.flag = 4;
                    }
                }
            }
            this.dateChange(this.date)
        }
    };
</script>

