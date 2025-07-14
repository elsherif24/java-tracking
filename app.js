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
        document.getElementById('exportStats').addEventListener('click', () => this.exportProgress());
        document.getElementById('importData').addEventListener('click', () => this.showImportDialog());

        // Daily hours input
        document.getElementById('dailyHours').addEventListener('change', () => this.updateOverallProgress());

        // Modal event listeners
        this.bindModalEvents();
    }

    renderChapters() {
        const container = document.getElementById('chaptersContainer');
        container.innerHTML = '';

        // Find the current working chapter (first incomplete chapter)
        const currentWorkingChapter = this.findCurrentWorkingChapter();

        // Create working on section
        if (currentWorkingChapter !== -1) {
            const workingOnSection = document.createElement('div');
            workingOnSection.className = 'working-on-section';
            workingOnSection.innerHTML = '<h2>📖 Currently Working On</h2>';

            const workingChapter = this.createChapterElement(CHAPTERS_DATA[currentWorkingChapter], currentWorkingChapter, true);
            workingOnSection.appendChild(workingChapter);
            container.appendChild(workingOnSection);
        }

        // Create all chapters section
        const allChaptersSection = document.createElement('div');
        allChaptersSection.className = 'all-chapters-section';
        allChaptersSection.innerHTML = '<h2>📚 All Chapters Progress</h2>';

        // Create chapters grid for summary view
        const chaptersGrid = document.createElement('div');
        chaptersGrid.className = 'chapters-summary-grid';

        CHAPTERS_DATA.forEach((chapter, index) => {
            const summaryElement = this.createChapterSummaryElement(chapter, index);
            chaptersGrid.appendChild(summaryElement);
        });

        allChaptersSection.appendChild(chaptersGrid);
        container.appendChild(allChaptersSection);
    }

    findCurrentWorkingChapter() {
        for (let i = 0; i < CHAPTERS_DATA.length; i++) {
            const progress = this.progressData[i] || { pagesRead: 0, problemsSolved: 0, mcqDone: false, checkpointDone: false };
            if (!this.isChapterCompleted(CHAPTERS_DATA[i], progress)) {
                return i;
            }
        }
        return -1; // All chapters completed
    }

    createChapterSummaryElement(chapter, index) {
        const chapterNum = String(index + 1).padStart(2, '0');
        const progress = this.progressData[index] || { pagesRead: 0, problemsSolved: 0, mcqDone: false, checkpointDone: false };
        const progressPercentage = this.calculateChapterProgress(chapter, progress);
        const isCompleted = this.isChapterCompleted(chapter, progress);

        const summaryDiv = document.createElement('div');
        summaryDiv.className = `chapter-summary ${isCompleted ? 'completed' : 'in-progress'}`;

        summaryDiv.innerHTML = `
            <div class="chapter-summary-header">
                <div class="chapter-number">Ch ${chapterNum}</div>
                <div class="chapter-status">${isCompleted ? '✅' : '📖'}</div>
            </div>
            <div class="chapter-summary-title">${chapter.title}</div>
            <div class="chapter-summary-progress">
                <div class="progress-circle" data-progress="${progressPercentage}">
                    <span>${progressPercentage}%</span>
                </div>
            </div>
            <div class="chapter-summary-stats">
                <span class="stat">📄 ${progress.pagesRead}/${chapter.pages}</span>
                <span class="stat">🧩 ${progress.problemsSolved}/${chapter.problems}</span>
            </div>
        `;

        // Add click event to expand the chapter details
        summaryDiv.addEventListener('click', () => {
            this.showChapterDetails(chapter, index);
        });

        return summaryDiv;
    }

    showChapterDetails(chapter, index) {
        // Create a modal to show detailed chapter information
        const modal = document.getElementById('celebrationModal');
        const titleElement = modal.querySelector('h2');
        const messageElement = document.getElementById('celebrationMessage');

        const progress = this.progressData[index] || { pagesRead: 0, problemsSolved: 0, mcqDone: false, checkpointDone: false };
        const chapterNum = String(index + 1).padStart(2, '0');

        titleElement.textContent = `Chapter ${chapterNum} Details`;
        messageElement.innerHTML = `
            <div class="chapter-details">
                <h3>${chapter.title}</h3>
                <div class="detail-stats">
                    <p>📖 Reading: ${progress.pagesRead}/${chapter.pages} pages (${Math.round((progress.pagesRead / chapter.pages) * 100)}%)</p>
                    <p>🧩 Problems: ${progress.problemsSolved}/${chapter.problems} solved (${Math.round((progress.problemsSolved / chapter.problems) * 100)}%)</p>
                    <p>📝 MCQ Quiz: ${progress.mcqDone ? '✅ Completed' : '❌ Not completed'}</p>
                    <p>🎯 Checkpoint: ${progress.checkpointDone ? '✅ Completed' : '❌ Not completed'}</p>
                    <p><strong>Overall Progress: ${this.calculateChapterProgress(chapter, progress)}%</strong></p>
                </div>
            </div>
        `;

        modal.classList.add('show');
    }

    createChapterElement(chapter, index, isWorkingChapter = false) {
        const chapterNum = String(index + 1).padStart(2, '0');
        const progress = this.progressData[index] || { pagesRead: 0, problemsSolved: 0, mcqDone: false, checkpointDone: false };

        const chapterDiv = document.createElement('div');
        chapterDiv.className = 'chapter';
        chapterDiv.id = `chapter${index}`;

        if (this.isChapterCompleted(chapter, progress)) {
            chapterDiv.classList.add('completed');
        }

        if (isWorkingChapter) {
            chapterDiv.classList.add('working-chapter');
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
                <!-- Reading Progress -->
                <div class="progress-item reading-progress">
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
                
                <!-- Checkpoint -->
                <div class="checkbox-container clickable-checkbox" data-chapter="${index}" data-type="checkpoint">
                    <div class="custom-checkbox ${progress.checkpointDone ? 'checked' : ''}" 
                         data-chapter="${index}" 
                         data-type="checkpoint"></div>
                    <span class="checkbox-label">Chapter checkpoint completed (5% of chapter)</span>
                </div>
                
                <!-- MCQ Quiz -->
                <div class="checkbox-container clickable-checkbox" data-chapter="${index}" data-type="mcq">
                    <div class="custom-checkbox ${progress.mcqDone ? 'checked' : ''}" 
                         data-chapter="${index}" 
                         data-type="mcq"></div>
                    <span class="checkbox-label">Chapter MCQ Quiz completed (10% of chapter)</span>
                </div>
                
                <!-- Problems -->
                <div class="progress-item problems-progress">
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
                
                ${this.isChapterCompleted(chapter, progress) ? '<div class="achievement-badge">✅ Chapter Completed!</div>' : ''}
                
                <div class="time-estimate">
                    <h4>⏱️ Time Estimates</h4>
                    <div class="time-info">
                        <div>📖 Reading: ${Math.ceil((chapter.pages - progress.pagesRead) * AVERAGE_READING_SPEED)} minutes remaining</div>
                        <div>🧩 Problems: ${Math.ceil((chapter.problems - progress.problemsSolved) * AVERAGE_PROBLEM_TIME)} minutes remaining</div>
                        <div>📝 Checkpoint: ${progress.checkpointDone ? '0' : MCQ_QUIZ_TIME} minutes remaining</div>
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

        // Checkbox event listeners (both checkbox and container)
        chapterDiv.querySelectorAll('.custom-checkbox').forEach(checkbox => {
            checkbox.addEventListener('click', (e) => this.toggleCheckbox(e));
        });

        chapterDiv.querySelectorAll('.clickable-checkbox').forEach(container => {
            container.addEventListener('click', (e) => {
                if (!e.target.classList.contains('custom-checkbox')) {
                    const checkbox = container.querySelector('.custom-checkbox');
                    this.toggleCheckbox({ target: checkbox });
                }
            });
        });

        // Auto-expand if this is the working chapter
        if (isWorkingChapter) {
            const content = chapterDiv.querySelector('.chapter-content');
            const header = chapterDiv.querySelector('.chapter-header');
            content.classList.add('active');
            header.classList.add('active');
        }

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
        const checkpointTime = progress.checkpointDone ? 0 : MCQ_QUIZ_TIME;

        return readingTime + problemTime + checkpointTime;
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
            // Check for reading milestones
            if (value === CHAPTERS_DATA[chapterIndex].pages) {
                this.showTaskCompletion('📖 Reading Complete!', `Great job! You've finished reading Chapter ${chapterIndex + 1}!`);
            }
        } else if (type === 'problems') {
            this.progressData[chapterIndex].problemsSolved = value;
            // Check for problem-solving milestones
            if (value === CHAPTERS_DATA[chapterIndex].problems) {
                this.showTaskCompletion('🧩 All Problems Solved!', `Excellent! You've solved all problems in Chapter ${chapterIndex + 1}!`);
            }
        }

        this.saveProgressData();
        this.updateChapterDisplay(chapterIndex);
        this.updateOverallProgress();

        // Check for completion and show celebration
        this.checkForCompletionCelebration(chapterIndex);

        // Check if we need to update the working chapter display
        this.updateWorkingChapterIfNeeded();
    }

    toggleCheckbox(event) {
        const chapterIndex = parseInt(event.target.dataset.chapter);
        const type = event.target.dataset.type;

        if (!this.progressData[chapterIndex]) {
            this.progressData[chapterIndex] = { pagesRead: 0, problemsSolved: 0, mcqDone: false, checkpointDone: false };
        }

        if (type === 'mcq') {
            this.progressData[chapterIndex].mcqDone = !this.progressData[chapterIndex].mcqDone;
            if (this.progressData[chapterIndex].mcqDone) {
                this.showTaskCompletion('📝 MCQ Quiz Complete!', `Well done! You've completed the MCQ quiz for Chapter ${chapterIndex + 1}!`);
            }
        } else if (type === 'checkpoint') {
            this.progressData[chapterIndex].checkpointDone = !this.progressData[chapterIndex].checkpointDone;
            if (this.progressData[chapterIndex].checkpointDone) {
                this.showTaskCompletion('🎯 Checkpoint Reached!', `Awesome! You've completed the checkpoint for Chapter ${chapterIndex + 1}!`);
            }
        }

        event.target.classList.toggle('checked');

        this.saveProgressData();
        this.updateChapterDisplay(chapterIndex);
        this.updateOverallProgress();

        // Check for completion and show celebration
        this.checkForCompletionCelebration(chapterIndex);

        // Check if we need to update the working chapter display
        this.updateWorkingChapterIfNeeded();
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

        // Count remaining checkpoints
        let remainingCheckpoints = 0;
        CHAPTERS_DATA.forEach((_, index) => {
            const progress = this.progressData[index] || { checkpointDone: false };
            if (!progress.checkpointDone) remainingCheckpoints++;
        });

        const readingTime = Math.ceil(remainingPages * AVERAGE_READING_SPEED / 60); // Convert to hours
        const problemTime = Math.ceil(remainingProblems * AVERAGE_PROBLEM_TIME / 60); // Convert to hours
        const checkpointTime = Math.ceil(remainingCheckpoints * MCQ_QUIZ_TIME / 60); // Convert to hours
        const totalTime = readingTime + problemTime + checkpointTime;

        document.getElementById('readingTime').textContent = `${readingTime} hours`;
        document.getElementById('problemTime').textContent = `${problemTime} hours`;
        document.getElementById('totalTime').textContent = `${totalTime} hours`;

        // Calculate completion date based on user input
        const dailyHours = parseFloat(document.getElementById('dailyHours').value) || 4;
        const daysToComplete = Math.ceil(totalTime / dailyHours);
        const completionDate = new Date();
        completionDate.setDate(completionDate.getDate() + daysToComplete);

        document.getElementById('completionDate').textContent =
            totalTime > 0 ? completionDate.toLocaleDateString() : 'Completed! 🎉';
    }

    bindModalEvents() {
        // Celebration modal
        const celebrationModal = document.getElementById('celebrationModal');
        const confirmationModal = document.getElementById('confirmationModal');

        // Close buttons
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                celebrationModal.classList.remove('show');
                confirmationModal.classList.remove('show');
            });
        });

        // Confirmation modal buttons (for import)
        document.getElementById('confirmYes').addEventListener('click', () => {
            this.processImport();
            confirmationModal.classList.remove('show');
        });

        document.getElementById('confirmNo').addEventListener('click', () => {
            confirmationModal.classList.remove('show');
        });

        // Click outside to close
        [celebrationModal, confirmationModal].forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('show');
                }
            });
        });
    }

    showImportDialog() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.style.display = 'none';

        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        this.importData = JSON.parse(e.target.result);
                        this.showImportConfirmation();
                    } catch (error) {
                        alert('Invalid file format. Please select a valid JSON file.');
                    }
                };
                reader.readAsText(file);
            }
        });

        document.body.appendChild(input);
        input.click();
        document.body.removeChild(input);
    }

    showImportConfirmation() {
        const modal = document.getElementById('confirmationModal');
        const message = document.getElementById('confirmationMessage');
        message.textContent = 'Import progress data? This will overwrite your current progress.';
        modal.classList.add('show');
    }

    processImport() {
        if (this.importData && this.importData.progressData) {
            this.progressData = this.importData.progressData;
            this.saveProgressData();
            this.renderChapters();
            this.updateOverallProgress();
            this.showCelebration('� Data Imported!', 'Your progress has been successfully imported!');
        } else if (this.importData) {
            // Try to handle different formats
            this.progressData = this.importData;
            this.saveProgressData();
            this.renderChapters();
            this.updateOverallProgress();
            this.showCelebration('📊 Data Imported!', 'Your progress has been successfully imported!');
        }
        this.importData = null;
    }

    exportProgress() {
        const stats = {
            exportDate: new Date().toISOString(),
            progressData: this.progressData,
            detailedStats: this.generateProgressStats()
        };

        const dataStr = JSON.stringify(stats, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `java-study-progress-${new Date().toISOString().split('T')[0]}.json`;
        link.click();

        this.showCelebration('📊 Data Exported!', 'Your progress has been exported successfully.');
    }

    generateProgressStats() {
        let totalPagesRead = 0;
        let totalProblemsSolved = 0;
        let chaptersCompleted = 0;
        const chapterDetails = [];

        CHAPTERS_DATA.forEach((chapter, index) => {
            const progress = this.progressData[index] || { pagesRead: 0, problemsSolved: 0, mcqDone: false, checkpointDone: false };
            const chapterProgress = this.calculateChapterProgress(chapter, progress);
            const isCompleted = this.isChapterCompleted(chapter, progress);

            totalPagesRead += progress.pagesRead;
            totalProblemsSolved += progress.problemsSolved;
            if (isCompleted) chaptersCompleted++;

            chapterDetails.push({
                chapterNumber: index + 1,
                title: chapter.title,
                pagesRead: progress.pagesRead,
                totalPages: chapter.pages,
                problemsSolved: progress.problemsSolved,
                totalProblems: chapter.problems,
                mcqCompleted: progress.mcqDone,
                checkpointCompleted: progress.checkpointDone,
                progressPercentage: chapterProgress,
                completed: isCompleted
            });
        });

        const overallProgress = (totalPagesRead / TOTAL_PAGES + totalProblemsSolved / TOTAL_PROBLEMS) / 2 * 100;

        return {
            exportDate: new Date().toISOString(),
            summary: {
                chaptersCompleted,
                totalChapters: CHAPTERS_DATA.length,
                totalPagesRead,
                totalPages: TOTAL_PAGES,
                totalProblemsSolved,
                totalProblems: TOTAL_PROBLEMS,
                overallProgressPercentage: Math.round(overallProgress)
            },
            chapterDetails
        };
    }

    showTaskCompletion(title, message) {
        // Show a brief celebration for task completion
        const notification = document.createElement('div');
        notification.className = 'task-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <h3>${title}</h3>
                <p>${message}</p>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 2000);
    }

    showCelebration(title, message) {
        const modal = document.getElementById('celebrationModal');
        const messageElement = document.getElementById('celebrationMessage');
        const titleElement = modal.querySelector('h2');

        titleElement.textContent = title;
        messageElement.textContent = message;
        modal.classList.add('show');

        // Auto-close after 3 seconds
        setTimeout(() => {
            modal.classList.remove('show');
        }, 3000);
    }

    checkForCompletionCelebration(chapterIndex) {
        const chapter = CHAPTERS_DATA[chapterIndex];
        const progress = this.progressData[chapterIndex];

        if (this.isChapterCompleted(chapter, progress)) {
            const chapterNum = String(chapterIndex + 1).padStart(2, '0');
            this.showCelebration(
                '🎉 Chapter Completed!',
                `Congratulations! You've completed Chapter ${chapterNum}: ${chapter.title}`
            );
        }

        // Check for overall completion
        const totalCompleted = CHAPTERS_DATA.reduce((count, chapter, index) => {
            const progress = this.progressData[index] || { pagesRead: 0, problemsSolved: 0, mcqDone: false, checkpointDone: false };
            return count + (this.isChapterCompleted(chapter, progress) ? 1 : 0);
        }, 0);

        if (totalCompleted === CHAPTERS_DATA.length) {
            setTimeout(() => {
                this.showCelebration(
                    '🏆 Book Completed!',
                    'Amazing! You\'ve completed the entire Java Programming textbook! You\'re now ready to tackle advanced Java topics!'
                );
            }, 1000);
        }
    }

    updateWorkingChapterIfNeeded() {
        // Re-render chapters to update the working chapter display
        this.renderChapters();
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new StudyTracker();
});