var app = new Vue({
	el: '#app',
	data: {
		selectedPatientVisitDate: new Date(),
		showVisitDateDropDown: false,
		visitDateArray: [],
		visitDateArrayIndex: 0,
		currentPatientList: {},
		selectedPatient: {}
	},
	methods: {
		addDays: function(date, days) {
			var result = new Date(date);
			result.setDate(result.getDate() + days);
			return result;
		},
		initVisitDates: function() {
			var dateArraySize = 5, dateArrayHalfSize = Math.floor(dateArraySize/2), today = new Date(), startDate = this.addDays(today, -dateArrayHalfSize);
			for (var i = 0; i < dateArraySize; i++) {
				var visitDate = { day: this.addDays(startDate, i), patients: [] };
				this.visitDateArray.push(visitDate);
			}
			this.visitDateArrayIndex = dateArrayHalfSize;
		},
		formatDate: function(date) {
			var d = new Date(date);
			return d.getDate() + '/' + d.getMonth() + '/' + d.getFullYear();
		},
		changeVisitDate(event) {
			this.showVisitDateDropDown = !this.showVisitDateDropDown;
			var elem = event.target;
			var rowIndex = elem.getAttribute("data-rowindex");
			this.visitDateArrayIndex = rowIndex;
			this.selectedPatientVisitDate = this.visitDateArray[this.visitDateArrayIndex].day;
			this.currentPatientList = this.visitDateArray[this.visitDateArrayIndex].patients;
			if (this.currentPatientList.length > 0) {
				this.selectedPatient = this.currentPatientList[0];
				this.$emit('patientChanged', this.selectedPatient.patientNote);
			} else {
				this.selectedPatient = {};
				this.$emit('patientChanged', '');
			}
		},
		addNewPatient: function () {
			var newPatient = {};
			newPatient.name = "New Patient - " + (this.visitDateArray[this.visitDateArrayIndex].patients.length + 1);
			newPatient.patientNote = "";
			this.selectedPatient = newPatient;
			this.visitDateArray[this.visitDateArrayIndex].patients.push(newPatient);
			this.currentPatientList = this.visitDateArray[this.visitDateArrayIndex].patients;
			this.$emit('patientChanged', '');
		},
		changeSelectedPatient: function(event) {
			var elem = event.target;
			var rowIndex = elem.getAttribute("data-rowindex");
			this.selectedPatient = this.currentPatientList[rowIndex];
			this.$emit('patientChanged', this.selectedPatient.patientNote);
		},
		patientChanged: function(value) {
			
		}
	},
	beforeMount: function() {
		this.initVisitDates();
	}
});

var editor = CKEDITOR.replace('patientNote');
var patientNoteHidden = document.getElementById("patientNoteHidden");
editor.on('change', function() {
	app.$refs.patientNoteHidden.value = editor.getData();
	patientNoteHidden.dispatchEvent(new Event('input', { 'bubbles': true }));
});
app.$on('patientChanged', function (value) {
	editor.setData(value);
});

