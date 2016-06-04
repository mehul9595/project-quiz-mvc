﻿(function(angular, Bookblock, quiz) {
    'use strict';

    if (!angular || !quiz) {
        throw new Error('Solve quiz module has missing dependencies');
    }

    function SolveQuizController($http, errorHandler) {
        var self = this;

        console.log('Hello from Solve Quiz Controller');
        console.log(quiz);

        self.questionTemplate = '/Content/templates/solve-question-template.html';
        self.quiz = quiz;
        self.questionsCount = quiz.Questions.length;
        self.page = 1;
        self.questionsPerPage = 2;

        self.progress = function progress() {
            var total = self.quiz.Questions.length,
                selected = self.quiz.Questions.filter(function(question) {
                    return question.selected !== undefined;
                }).length;

            var completedInPercent = (selected / total) * 100;

            return completedInPercent;
        };

        self.slickConfig = {
            infinite: false,
            arrows: true,
            appendArrows: '.slide-controls',
            prevArrow: '.control-left',
            nextArrow: '.control-right',
            centerMode: true,
            centerPadding: '250px 35px',
            slidesToShow: 1,
            method: {},
            responsive: [
                {
                    breakpoint: 740,
                    settings: {
                        arrows: false,
                        centerMode: true,
                        centerPadding: '0',
                        slidesToShow: 1
                    }
                }
            ]
        }

        self.submit = function submit() {
            var data = {
                forQuizId: quiz.Id,
                selectedAnswerIds: quiz.Questions.map(function(question) {
                    console.log(question.Answers[question.selected].Id);
                    var id = question.Answers[question.selected].Id;
                    return id;
                })
            };

            console.log("posting data....", data);
            $http.post('/SolveQuiz/solve', data)
                .then(function(response) {
                    console.log(response);
                    document.open();
                    document.write(response.data);
                    document.close();
                }, errorHandler.handleSoveQuizError);
        }

        self.next = function next() {
            if (self.page < self.questionsCount - 1) self.page++;
            else return;

            flip(self.bookBlock.next.bind(self.bookBlock));
        }

        self.prev = function prev() {
            if (self.page > 1) self.page--;
            else return;

            flip(self.bookBlock.prev.bind(self.bookBlock));
        }

        var $book = document.getElementById('bb-blockbook');
        setTimeout(function() {
            self.bookBlock = new BookBlock($book, {
                speed: 500,
                shadowSides: 0.8,
                shadowFlip: 0.7
            }, 1000);
        });
    }

    function flip(callback) {
        setTimeout(callback, 60);
    }

    angular.module('solveQuiz', ['ui.bootstrap', 'slickCarousel', 'paging', 'errorHandler'])
        .controller('SolveQuizController', ['$http', 'errorHandler', SolveQuizController]);
})(window.angular, window.BookBlock, window.quiz);