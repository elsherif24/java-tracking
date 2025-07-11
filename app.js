class StudyTracker {
    constructor() {
        this.progressData = {};
        this.init();
    }

    init() {
        this.loadProgressData();
        this.renderChapters();
        this.bindEvents();
        this.updateOverallProgress();
    }

    loadProgressData() {
        try {
            const saved = localStorage.getItem('javaStudyProgress');
            if (saved) {
                this.progressData = JSON.parse(saved);
            } else {
                this.progressData = {};
            }
        } catch (error) {
            console.error('Error loading progress data:', error);
            this.progressData = {};
        }
    }

    saveProgressData() {
        try {
            localStorage.setItem('javaStudyProgress', JSON.stringify(this.progressData));
        } catch (error) {
            console.error('Error saving progress:', error);
        }
    }

    bindEvents() {
        // Control buttons
        document.getElementById('expandAll').addEventListener('click', () => this.expandAllChapters());
        document.getElementById('collapseAll').addEventListener('click', () => this.collapseAllChapters());

        // Search functionality
        document.getElementById('searchInput').addEventListener('input', (e) => this.filterChapters(e.target.value));
    }

    renderChapters() {
        const container = document.getElementById('chaptersContainer');
        container.innerHTML = '';

        CHAPTERS_DATA.forEach((chapter, index) => {
            const chapterElement = this.createChapterElement(chapter, index);
            container.appendChild(chapterElement);
        });
    }

    createChapterElement(chapter, index) {
        const chapterNum = String(index + 1).padStart(2, '0');
        const progress = this.progressData[index] || { pagesRead: 0, problemsSolved: 0, mcqDone: false, checkpointDone: false };

        const chapterDiv = document.createElement('div');
        chapterDiv.className = 'chapter';
        chapterDiv.id = `chapter${index}`;

        if (this.isChapterCompleted(chapter, progress)) {
            chapterDiv.classList.add('completed');
        }

        chapterDiv.innerHTML = `
            <div class="chapter-header" data-chapter="${index}">
                <div class="chapter-title">Chapter ${chapterNum} - ${chapter.title}</div>
                <div class="chapter-progress-indicator" id="chapterProgress${index}">
                    ${this.calculateChapterProgress(chapter, progress)}%
                </div>
                <div class="expand-icon">▼</div>
            </div>
            <div class="chapter-content" id="chapterContent${index}">
                <div class="progress-grid">
                    <div class="progress-item">
                        <h4>📖 Reading Progress</h4>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${(progress.pagesRead / chapter.pages) * 100}%"></div>
                        </div>
                        <div class="input-group">
                            <input type="number" class="progress-input" 
                                   value="${progress.pagesRead}" 
                                   max="${chapter.pages}" 
                                   min="0"
                                   data-chapter="${index}" 
                                   data-type="pages">
                            <span>/ ${chapter.pages} pages</span>
                        </div>
                        <div class="progress-text">
                            ${progress.pagesRead} of ${chapter.pages} pages read (35% of chapter)
                        </div>
                    </div>
                    
                    <div class="progress-item">
                        <h4>🧩 Problems Solved</h4>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${(progress.problemsSolved / chapter.problems) * 100}%"></div>
                        </div>
                        <div class="input-group">
                            <input type="number" class="progress-input" 
                                   value="${progress.problemsSolved}" 
                                   max="${chapter.problems}" 
                                   min="0"
                                   data-chapter="${index}" 
                                   data-type="problems">
                            <span>/ ${chapter.problems} problems</span>
                        </div>
                        <div class="progress-text">
                            ${progress.problemsSolved} of ${chapter.problems} problems solved (50% of chapter)
                        </div>
                    </div>
                </div>
                
                <div class="checkbox-container">
                    <div class="custom-checkbox ${progress.mcqDone ? 'checked' : ''}" 
                         data-chapter="${index}" 
                         data-type="mcq"></div>
                    <span>Chapter MCQ Quiz completed (10% of chapter)</span>
                </div>
                
                <div class="checkbox-container">
                    <div class="custom-checkbox ${progress.checkpointDone ? 'checked' : ''}" 
                         data-chapter="${index}" 
                         data-type="checkpoint"></div>
                    <span>Chapter checkpoint completed (5% of chapter)</span>
                    ${this.isChapterCompleted(chapter, progress) ? '<span class="achievement-badge">✅ Completed!</span>' : ''}
                </div>
                
                <div class="time-estimate">
                    <h4>⏱️ Time Estimates</h4>
                    <div class="time-info">
                        <div>📖 Reading: ${Math.ceil((chapter.pages - progress.pagesRead) * AVERAGE_READING_SPEED)} minutes remaining</div>
                        <div>🧩 Problems: ${Math.ceil((chapter.problems - progress.problemsSolved) * AVERAGE_PROBLEM_TIME)} minutes remaining</div>
                        <div>📝 MCQ Quiz: ${progress.mcqDone ? '0' : MCQ_QUIZ_TIME} minutes remaining</div>
                        <div>📚 Total: ${this.calculateRemainingTime(chapter, progress)} minutes remaining</div>
                    </div>
                </div>
            </div>
        `;

        // Add event listeners
        chapterDiv.querySelector('.chapter-header').addEventListener('click', () => this.toggleChapter(index));

        // Input event listeners
        chapterDiv.querySelectorAll('.progress-input').forEach(input => {
            input.addEventListener('change', (e) => this.updateChapterProgress(e));
        });

        // Checkbox event listeners
        chapterDiv.querySelectorAll('.custom-checkbox').forEach(checkbox => {
            checkbox.addEventListener('click', (e) => this.toggleCheckbox(e));
        });

        return chapterDiv;
    }

    calculateChapterProgress(chapter, progress) {
        const readingProgress = (progress.pagesRead / chapter.pages) * 35;
        const problemProgress = (progress.problemsSolved / chapter.problems) * 50;
        const mcqProgress = progress.mcqDone ? 10 : 0;
        const checkpointProgress = progress.checkpointDone ? 5 : 0;

        return Math.round(readingProgress + problemProgress + mcqProgress + checkpointProgress);
    }

    calculateRemainingTime(chapter, progress) {
        const readingTime = (chapter.pages - progress.pagesRead) * AVERAGE_READING_SPEED;
        const problemTime = (chapter.problems - progress.problemsSolved) * AVERAGE_PROBLEM_TIME;
        const mcqTime = progress.mcqDone ? 0 : MCQ_QUIZ_TIME;

        return readingTime + problemTime + mcqTime;
    }

    isChapterCompleted(chapter, progress) {
        return progress.pagesRead === chapter.pages &&
            progress.problemsSolved === chapter.problems &&
            progress.mcqDone &&
            progress.checkpointDone;
    }

    toggleChapter(index) {
        const content = document.getElementById(`chapterContent${index}`);
        const header = content.previousElementSibling;

        content.classList.toggle('active');
        header.classList.toggle('active');
    }

    expandAllChapters() {
        CHAPTERS_DATA.forEach((_, index) => {
            const content = document.getElementById(`chapterContent${index}`);
            const header = content.previousElementSibling;
            content.classList.add('active');
            header.classList.add('active');
        });
    }

    collapseAllChapters() {
        CHAPTERS_DATA.forEach((_, index) => {
            const content = document.getElementById(`chapterContent${index}`);
            const header = content.previousElementSibling;
            content.classList.remove('active');
            header.classList.remove('active');
        });
    }

    updateChapterProgress(event) {
        const chapterIndex = parseInt(event.target.dataset.chapter);
        const type = event.target.dataset.type;
        const value = Math.max(0, Math.min(parseInt(event.target.value) || 0,
            type === 'pages' ? CHAPTERS_DATA[chapterIndex].pages : CHAPTERS_DATA[chapterIndex].problems));

        // Update the input value to the constrained value
        event.target.value = value;

        if (!this.progressData[chapterIndex]) {
            this.progressData[chapterIndex] = { pagesRead: 0, problemsSolved: 0, mcqDone: false, checkpointDone: false };
        }

        if (type === 'pages') {
            this.progressData[chapterIndex].pagesRead = value;
        } else if (type === 'problems') {
            this.progressData[chapterIndex].problemsSolved = value;
        }

        this.saveProgressData();
        this.updateChapterDisplay(chapterIndex);
        this.updateOverallProgress();
    }

    toggleCheckbox(event) {
        const chapterIndex = parseInt(event.target.dataset.chapter);
        const type = event.target.dataset.type;

        if (!this.progressData[chapterIndex]) {
            this.progressData[chapterIndex] = { pagesRead: 0, problemsSolved: 0, mcqDone: false, checkpointDone: false };
        }

        if (type === 'mcq') {
            this.progressData[chapterIndex].mcqDone = !this.progressData[chapterIndex].mcqDone;
        } else if (type === 'checkpoint') {
            this.progressData[chapterIndex].checkpointDone = !this.progressData[chapterIndex].checkpointDone;
        }

        event.target.classList.toggle('checked');

        this.saveProgressData();
        this.updateChapterDisplay(chapterIndex);
        this.updateOverallProgress();
    }

    updateChapterDisplay(chapterIndex) {
        const chapter = CHAPTERS_DATA[chapterIndex];
        const progress = this.progressData[chapterIndex] || { pagesRead: 0, problemsSolved: 0, mcqDone: false, checkpointDone: false };

        // Update progress indicator
        const progressIndicator = document.getElementById(`chapterProgress${chapterIndex}`);
        progressIndicator.textContent = `${this.calculateChapterProgress(chapter, progress)}%`;

        // Update progress bars
        const chapterElement = document.getElementById(`chapter${chapterIndex}`);
        const progressBars = chapterElement.querySelectorAll('.progress-fill');
        progressBars[0].style.width = `${(progress.pagesRead / chapter.pages) * 100}%`;
        progressBars[1].style.width = `${(progress.problemsSolved / chapter.problems) * 100}%`;

        // Update progress text
        const progressTexts = chapterElement.querySelectorAll('.progress-text');
        progressTexts[0].textContent = `${progress.pagesRead} of ${chapter.pages} pages read (35% of chapter)`;
        progressTexts[1].textContent = `${progress.problemsSolved} of ${chapter.problems} problems solved (50% of chapter)`;

        // Update time estimates
        const timeInfo = chapterElement.querySelector('.time-info');
        timeInfo.innerHTML = `
            <div>📖 Reading: ${Math.ceil((chapter.pages - progress.pagesRead) * AVERAGE_READING_SPEED)} minutes remaining</div>
            <div>🧩 Problems: ${Math.ceil((chapter.problems - progress.problemsSolved) * AVERAGE_PROBLEM_TIME)} minutes remaining</div>
            <div>📝 MCQ Quiz: ${progress.mcqDone ? '0' : MCQ_QUIZ_TIME} minutes remaining</div>
            <div>📚 Total: ${this.calculateRemainingTime(chapter, progress)} minutes remaining</div>
        `;

        // Update chapter completion status
        if (this.isChapterCompleted(chapter, progress)) {
            chapterElement.classList.add('completed');
        } else {
            chapterElement.classList.remove('completed');
        }
    }

    updateOverallProgress() {
        let totalPagesRead = 0;
        let totalProblemsSolved = 0;
        let chaptersCompleted = 0;
        let totalReadingWeight = 0;
        let totalProblemWeight = 0;
        let totalMcqWeight = 0;
        let totalCheckpointWeight = 0;

        CHAPTERS_DATA.forEach((chapter, index) => {
            const progress = this.progressData[index] || { pagesRead: 0, problemsSolved: 0, mcqDone: false, checkpointDone: false };
            totalPagesRead += progress.pagesRead;
            totalProblemsSolved += progress.problemsSolved;

            // Calculate weighted progress
            totalReadingWeight += (progress.pagesRead / chapter.pages) * 35;
            totalProblemWeight += (progress.problemsSolved / chapter.problems) * 50;
            totalMcqWeight += progress.mcqDone ? 10 : 0;
            totalCheckpointWeight += progress.checkpointDone ? 5 : 0;

            if (this.isChapterCompleted(chapter, progress)) {
                chaptersCompleted++;
            }
        });

        const overallProgress = (totalReadingWeight + totalProblemWeight + totalMcqWeight + totalCheckpointWeight) / CHAPTERS_DATA.length;

        // Update summary cards
        document.getElementById('chaptersCompleted').textContent = chaptersCompleted;
        document.getElementById('totalPagesRead').textContent = totalPagesRead;
        document.getElementById('totalProblems').textContent = totalProblemsSolved;
        document.getElementById('overallPercent').textContent = `${Math.round(overallProgress)}%`;

        // Update progress bar
        document.getElementById('overallProgressFill').style.width = `${overallProgress}%`;

        // Update time estimates
        this.updateTimeEstimates(totalPagesRead, totalProblemsSolved);
    }

    updateTimeEstimates(totalPagesRead, totalProblemsSolved) {
        const remainingPages = TOTAL_PAGES - totalPagesRead;
        const remainingProblems = TOTAL_PROBLEMS - totalProblemsSolved;

        // Count remaining MCQ quizzes
        let remainingMcqQuizzes = 0;
        CHAPTERS_DATA.forEach((_, index) => {
            const progress = this.progressData[index] || { mcqDone: false };
            if (!progress.mcqDone) remainingMcqQuizzes++;
        });

        const readingTime = Math.ceil(remainingPages * AVERAGE_READING_SPEED / 60); // Convert to hours
        const problemTime = Math.ceil(remainingProblems * AVERAGE_PROBLEM_TIME / 60); // Convert to hours
        const mcqTime = Math.ceil(remainingMcqQuizzes * MCQ_QUIZ_TIME / 60); // Convert to hours
        const totalTime = readingTime + problemTime + mcqTime;

        document.getElementById('readingTime').textContent = `${readingTime} hours`;
        document.getElementById('problemTime').textContent = `${problemTime} hours`;
        document.getElementById('totalTime').textContent = `${totalTime} hours`;

        // Calculate completion date (assuming 2 hours of study per day)
        const studyHoursPerDay = 4;
        const daysToComplete = Math.ceil(totalTime / studyHoursPerDay);
        const completionDate = new Date();
        completionDate.setDate(completionDate.getDate() + daysToComplete);

        document.getElementById('completionDate').textContent =
            totalTime > 0 ? completionDate.toLocaleDateString() : 'Completed! 🎉';
    }

    filterChapters(searchTerm) {
        const chapters = document.querySelectorAll('.chapter');
        const term = searchTerm.toLowerCase();

        chapters.forEach(chapter => {
            const title = chapter.querySelector('.chapter-title').textContent.toLowerCase();
            if (title.includes(term)) {
                chapter.classList.remove('hidden');
            } else {
                chapter.classList.add('hidden');
            }
        });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new StudyTracker();
});