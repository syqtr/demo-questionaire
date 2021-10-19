<template>
  <div>
    <flow-form
      ref="flowform"
      @complete="onComplete"
      @submit="onSubmit"
      :questions="questions"
      :language="language"
      :standalone="true"
    >
      <!-- Custom content for the Complete/Submit screen slots in the FlowForm component -->
      <!-- We've overriden the default "complete" slot content -->
      <template v-slot:complete>
        <div class="f-section-wrap">
          <p>
            <span class="fh2">Finally.</span>
            <span class="f-section-text">
              To complete, please tell us a bit about your self
            </span>
          </p>
          <p class="f-description">
            Note: By submitting it, you authorized us to keep the record/video of your
          </p>
          <div class="f-answer">
            <div
              v-if="$browserDetect.meta.name === 'Safari'"
              class="vue-audio-recorder"
              :class="{ active: recording }"
              @click="handleRecordSafari"
            >
              <span></span>
            </div>
            <vue-record-audio
              v-else
              mode="press"
              @stream="onStream"
              @result="onResult"
            />
          </div>
        </div>
      </template>

      <!-- We've overriden the default "completeButton" slot content -->
      <template v-slot:completeButton>
        <div class="f-submit" v-if="!submitted && attachFile">
          <button
            class="o-btn-action"
            ref="button"
            type="submit"
            @click.prevent="$refs.flowform.submit()"
            aria-label="Press to submit"
          >
            <span>{{ language.submitText }}</span>
          </button>
        </div>

        <p class="text-success" v-if="submitted">Submitted succesfully.</p>
      </template>
    </flow-form>
  </div>
</template>

<script>
// If using the npm package, use the following line instead of the ones above.
import FlowForm, {
  QuestionModel,
  QuestionType,
  ChoiceOption,
  LanguageModel,
} from "@ditdot-dev/vue-flow-form";
import { VueRecordAudio } from "@codekraft-studio/vue-record";
import OpusMediaRecorder from "opus-media-recorder";
// Use worker-loader
import EncoderWorker from "worker-loader!opus-media-recorder/encoderWorker.js";

export default {
  components: {
    FlowForm,
    VueRecordAudio,
  },
  data() {
    return {
      submitted: false,
      completed: false,
      attachFile: null,
      recording: false,
      recorder: null,
      recordFile: null,
      language: new LanguageModel({
        enterKey: this.$t("enterKey"),
        shiftKey: this.$t("shiftKey"),
        ok: this.$t("ok"),
        continue: this.$t("continue"),
        skip: this.$t("skip"),
        pressEnter: this.$t("pressEnter"),
        multipleChoiceHelpText: this.$t("multipleChoiceHelpText"),
        multipleChoiceHelpTextSingle: this.$t("multipleChoiceHelpTextSingle"),
        otherPrompt: this.$t("otherPrompt"),
        placeholder: this.$t("placeholder"),
        submitText: this.$t("submitText"),
        longTextHelpText: this.$t("longTextHelpText"),
        prev: this.$t("prev"),
        next: this.$t("next"),
        percentCompleted: this.$t("percentCompleted"),
        invalidPrompt: this.$t("invalidPrompt"),
        thankYouText: this.$t("thankYouText"),
        successText: this.$t("successText"),
        ariaOk: this.$t("ariaOk"),
        ariaRequired: this.$t("ariaRequired"),
        ariaPrev: this.$t("ariaPrev"),
        ariaNext: this.$t("ariaNext"),
        ariaSubmitText: this.$t("ariaSubmitText"),
        ariaMultipleChoice: this.$t("ariaMultipleChoice"),
        ariaTypeAnswer: this.$t("ariaTypeAnswer"),
      }),
      questions: [
        new QuestionModel({
          id: "first_name",
          tagline: "Hi! Welcome to our demo survey 😊",
          title: "What is your first name?",
          type: QuestionType.Text,
          placeholder: "Start typing here...",
        }),
        new QuestionModel({
          id: "email",
          tagline: "Nice to meet you 👀, let's continue",
          title: "Provide an example email.",
          type: QuestionType.Email,
          placeholder: "Start typing here...",
        }),
        new QuestionModel({
          id: "phone",
          title: "Doing great! 👍 Go ahead and try with a phone number.",
          type: QuestionType.Phone,
          mask: "####-###-###",
        }),
        new QuestionModel({
          id: "place_choices",
          title: "Where are you from?",
          type: QuestionType.MultipleChoice,
          multiple: false,
          helpText: "Select your place. 👇",
          options: [
            new ChoiceOption({
              label: "Paris",
            }),
            new ChoiceOption({
              label: "Lodon",
            }),
            new ChoiceOption({
              label: "Helsinki",
            }),
            new ChoiceOption({
              label: "Berlin",
            }),
          ],
        }),
      ],
    };
  },

  beforeCreate() {
    // Check if MediaRecorder available.
    if (!window.MediaRecorder) {
      window.MediaRecorder = OpusMediaRecorder;
    }
  },

  methods: {
    /* eslint-disable-next-line no-unused-vars */
    onComplete(completed, questionList) {
      // This method is called whenever the "completed" status is changed.
      this.completed = completed;
    },

    /* eslint-disable-next-line no-unused-vars */
    onSubmit(questionList) {
      // This method will only be called if you don't override the
      // completeButton slot.
      // this.onSendData()
      console.log("onSubmit");
      this.submitted = true;
      console.log(questionList);
    },

    onSendData() {
      console.log("okeke onSendData");
      // Set `submitted` to true so the form knows not to allow back/forward
      // navigation anymore.
      // this.$refs.flowform.submit();
      this.$refs.flowform.submitted = true;

      this.submitted = true;

      /* eslint-disable-next-line no-unused-vars */
      const data = this.getData();
      /*
          You can use Fetch API to send the data to your server, eg.:

          fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          })
        */
    },

    getData() {
      const data = {
        questions: [],
        answers: [],
      };

      this.questions.forEach((question) => {
        if (question.title) {
          let answer = question.answer;
          if (Array.isArray(answer)) {
            answer = answer.join(", ");
          }

          data.questions.push(question.title);
          data.answers.push(answer);
        }
      });

      return data;
    },

    onStream(stream) {
      console.log("Got a stream object:", stream);
    },

    onResult(data) {
      console.log("onResult");
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
    },

    handleRecordSafari() {
      this.recording = !this.recording;
      if (this.recording) {
        console.log("Recording");
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
            this.recordFile = e.data;
          });
        });
      } else {
        console.log("End recording");
        const fileURL = window.URL.createObjectURL(new Blob([this.recordFile]));
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
        this.recorder.stop();
        this.recorder.removeEventListener("dataavailable", () => {
          this.recordFile = null;
        });
      }
    },
  },
};
</script>

<style scoped>
@import "~@ditdot-dev/vue-flow-form/dist/vue-flow-form.css";
@import "~@ditdot-dev/vue-flow-form/dist/vue-flow-form.theme-green.css";
</style>