/* eslint-disable vue/valid-template-root */
<template>
  <div class="record-container">
    <button class="btn-circle" v-if="dataValue" @click="setAnswer(dataValue)">
      <i class="fa fa-check"></i>
    </button>

    <div
      v-if="$browserDetect.meta.name === 'Safari'"
      class="vue-audio-recorder"
      :class="{ active: recording }"
      @click="handleRecordSafari"
    >
      <span></span>
    </div>

    <VueRecordAudio v-else mode="press" @result="onResult" />

    <audio ref="audioRef" v-show="dataValue" controls />

    <template v-if="dataValue">
      <button class="btn-circle" @click="$refs.audioRef.play()">
        <i class="fa fa-play-circle"></i>
      </button>

      <button class="btn-circle" @click="removeRecord">
        <i class="fa fa-trash" style="color: #ef5350"></i>
      </button>
    </template>

    <input
      ref="input"
      type="file"
      v-bind:accept="question.accept"
      v-bind:multiple="question.multiple"
      v-bind:required="question.required"
      v-on:keyup.enter.prevent="onEnter"
      v-on:keyup.tab.prevent="onEnter"
      v-on:focus="setFocus"
      v-on:blur="unsetFocus"
      v-on:change="onChange"
      style="display: none"
    />
  </div>
</template>

<script>
import BaseType from "./BaseType.vue";
import { QuestionType } from "../../models/QuestionModel";
import OpusMediaRecorder from "opus-media-recorder";
// Use worker-loader
import EncoderWorker from "worker-loader!opus-media-recorder/encoderWorker.js";

export default {
  extends: BaseType,
  name: QuestionType.File,

  components: {},

  data() {
    return {
      recording: false,
      recorder: null,
    };
  },

  mounted() {
    if (this.question.accept) {
      this.mimeTypeRegex = new RegExp(
        this.question.accept.replace("*", "[^\\/,]+")
      );
    }
  },

  beforeCreate() {
    // Check if MediaRecorder available.
    if (!window.MediaRecorder) {
      window.MediaRecorder = OpusMediaRecorder;
    }
  },

  methods: {
    onChange() {
      this.dirty = true;
      this.dataValue = this.files;
      this.onKeyDown();
    },

    onResult(data) {
      this.dirty = true;
      this.dataValue = window.URL.createObjectURL(data);
      this.$refs.audioRef.src = window.URL.createObjectURL(data);
      this.handleSaveFile(data);
    },

    handleSaveFile(data) {
      // Begin handle create file to download
      const fileURL = window.URL.createObjectURL(new Blob([data]));
      const fileLink = document.createElement("a");
      fileLink.href = fileURL;
      const mydate = new Date();
      const curr_date = ("0" + mydate.getDate()).slice(-2);
      const curr_month = ("0" + (mydate.getMonth() + 1)).slice(-2);
      const curr_year = mydate.getFullYear();
      const curr_hour = mydate.getHours();
      const curr_minute = mydate.getMinutes();
      const curr_seconds = mydate.getSeconds();
      const fileName = `${curr_year}${curr_month}${curr_date}_${curr_hour}${curr_minute}${curr_seconds}_record.wav`;
      fileLink.setAttribute("download", fileName);
      document.body.appendChild(fileLink);

      fileLink.click();
      // Save file to local
    },

    handleRecordSafari() {
      this.recording = !this.recording;
      if (this.recording) {
        console.log("Begin Recording");
        // Non-standard options
        const workerOptions = {
          encoderWorkerFactory: () => new EncoderWorker(),
          OggOpusEncoderWasmPath:
            "https://cdn.jsdelivr.net/npm/opus-media-recorder@latest/OggOpusEncoder.wasm",
          WebMOpusEncoderWasmPath:
            "https://cdn.jsdelivr.net/npm/opus-media-recorder@latest/WebMOpusEncoder.wasm",
        };

        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
          // Start recording
          this.recorder = new MediaRecorder(stream, {}, workerOptions);
          // Set record to <audio> when recording will be finished
          this.recorder.start();
          this.recorder.addEventListener("dataavailable", (e) => {
            const { data } = e;
            this.onResult(data);
          });
        });
      } else {
        console.log("End recording");
        this.recorder.stop();
      }
    },

    removeRecord() {
      this.dirty = true;
      this.dataValue = null;
      this.setAnswer(null);
    },
  },
  computed: {
    files() {
      return this.$refs.input.files;
    },
  },
};
</script>

<style scoped>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css");
.record-container {
  display: flex;
  align-items: center;
  margin-bottom: 3rem;
}
.record-container > * {
  margin-left: 1rem;
}
.btn-circle {
  width: 64px;
  height: 64px;
  padding: 0;
  font-size: 50%;
  border-radius: 50%;
}
</style>