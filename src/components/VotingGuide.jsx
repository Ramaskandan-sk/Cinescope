const VotingGuide = () => {
  return (
    <div className="card p-6 mb-6">
      <h3 className="text-xl font-bold text-white mb-4">
        💡 How Discussion Voting Works
      </h3>
      
      <div className="space-y-4 text-gray-300">
        <div className="flex items-start space-x-3">
          <div className="bg-green-500 text-white p-2 rounded-lg">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 3l7 7h-4v7H7v-7H3l7-7z" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="font-semibold text-white mb-1">Upvote (+1)</div>
            <p className="text-sm">
              Click the up arrow if you find the discussion interesting, helpful, or agree with it. 
              This helps quality content rise to the top!
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="bg-red-500 text-white p-2 rounded-lg">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 17l-7-7h4V3h6v7h4l-7 7z" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="font-semibold text-white mb-1">Downvote (-1)</div>
            <p className="text-sm">
              Click the down arrow if the discussion is off-topic, unhelpful, or you disagree. 
              Use responsibly to maintain quality discussions.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="bg-primary-600 text-white p-2 rounded-lg font-bold text-lg">
            42
          </div>
          <div className="flex-1">
            <div className="font-semibold text-white mb-1">Vote Score</div>
            <p className="text-sm">
              The number shows total votes (upvotes minus downvotes). 
              Higher scores mean more people found it valuable!
            </p>
          </div>
        </div>

        <div className="bg-dark-700 p-4 rounded-lg mt-4">
          <p className="text-sm text-gray-400">
            <span className="text-accent-400 font-semibold">Pro Tip:</span> You can change your vote 
            by clicking the same button again to remove it, or click the opposite button to switch your vote.
          </p>
        </div>
      </div>
    </div>
  )
}

export default VotingGuide
