class Solution {
public:
    bool isPossible(vector<int>& piles, int mid, int h){
        long long cnt = 0;
        for(int i = 0; i<piles.size(); i++){
            cnt+=(piles[i]+mid-1)/mid;
        }
        return cnt <= h;
    }
    int minEatingSpeed(vector<int>& piles, int h) {
        int max = *max_element(piles.begin(), piles.end());
        int l=1;
        int r=max;
        int ans=max;
        while(l <= r){
            int mid = (l + r) / 2;

            if(isPossible(piles, mid, h)){
                ans = mid;
                r = mid - 1;
            }
            else{
                l = mid + 1;
            }
        }
        return ans;
    }
};
